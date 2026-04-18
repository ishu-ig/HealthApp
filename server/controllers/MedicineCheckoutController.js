const MedicineCheckout = require("../models/MedicineCheckout");
const Razorpay = require("razorpay");
const mailer   = require("../mailer/index");

// ─── Shared populate helper ───────────────────────────────────────────────────
// FIX: was populating "products.product" with "maincategory"/"resturent" fields
// which belong to the old food-delivery schema, not MedicineCheckout.
// MedicineCheckout schema stores medicines as a plain array (medicines: [])
// so there is nothing to populate on the items themselves — only "user" is a ref.
function buildQuery(query) {
    return query.populate(
        "user",
        ["name", "username", "email", "phone", "state", "city", "pin", "address"]
    );
}

// ─── Razorpay: create order ───────────────────────────────────────────────────
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id:     process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount:   req.body.amount * 100,   // paise
            currency: "INR",
        };

        instance.orders.create(options, (error, razorOrder) => {
            if (error) {
                console.error("Razorpay order error:", error);
                return res.status(500).json({ message: "Something went wrong with Razorpay." });
            }
            res.json({ data: razorOrder });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// ─── Razorpay: verify payment ─────────────────────────────────────────────────
async function verifyOrder(req, res) {
    try {
        const check = await MedicineCheckout.findOne({ _id: req.body.checkid });
        if (!check) {
            return res.status(404).send({ result: "Fail", reason: "Order not found" });
        }
        check.rppid         = req.body.razorpay_payment_id;
        check.paymentStatus = "Done";
        check.paymentMode   = "Net Banking";
        await check.save();
        res.send({ result: "Done", message: "Payment successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// ─── Create ───────────────────────────────────────────────────────────────────
async function createRecord(req, res) {
    try {
        const doc  = new MedicineCheckout(req.body);
        await doc.save();

        const finalData = await buildQuery(
            MedicineCheckout.findOne({ _id: doc._id })
        );

        res.send({ result: "Done", data: finalData });
    } catch (error) {
        const errorMessage = {};
        if (error.errors?.user)     errorMessage.user     = error.errors.user.message;
        if (error.errors?.subtotal) errorMessage.subtotal = error.errors.subtotal.message;
        if (error.errors?.shipping) errorMessage.shipping = error.errors.shipping.message;
        if (error.errors?.total)    errorMessage.total    = error.errors.total.message;

        if (Object.keys(errorMessage).length === 0) {
            console.error(error);
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage });
        }
    }
}

// ─── Get all ──────────────────────────────────────────────────────────────────
async function getRecord(req, res) {
    try {
        const data = await buildQuery(
            MedicineCheckout.find().sort({ _id: -1 })
        );
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Get by user ──────────────────────────────────────────────────────────────
async function getUserRecord(req, res) {
    try {
        const data = await buildQuery(
            MedicineCheckout.find({ user: req.params.userid }).sort({ _id: -1 })
        );
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Get single ───────────────────────────────────────────────────────────────
async function getSingleRecord(req, res) {
    try {
        const data = await buildQuery(
            MedicineCheckout.findOne({ _id: req.params._id })
        );
        if (data) {
            res.send({ result: "Done", data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Update ───────────────────────────────────────────────────────────────────
async function updateRecord(req, res) {
    try {
        const doc = await MedicineCheckout.findOne({ _id: req.params._id });
        if (!doc) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

        const previousOrderStatus = doc.orderStatus;

        doc.orderStatus   = req.body.orderStatus   ?? doc.orderStatus;
        doc.paymentMode   = req.body.paymentMode   ?? doc.paymentMode;
        doc.paymentStatus = req.body.paymentStatus ?? doc.paymentStatus;
        doc.rppid         = req.body.rppid         ?? doc.rppid;
        await doc.save();

        const finalData = await buildQuery(
            MedicineCheckout.findOne({ _id: doc._id })
        );

        // Send status-change email only when orderStatus actually changed
        if (req.body.orderStatus && req.body.orderStatus !== previousOrderStatus) {
            // FIX: switch was using .toLowerCase() on the input but cases were
            // mixed-case strings — they never matched. Now compare lowercase to lowercase.
            let statusMessage = "";
            switch (req.body.orderStatus.toLowerCase()) {
                case "order is under process":
                    statusMessage = "Your order is under process and will be packed soon!";
                    break;
                case "order is placed":
                    statusMessage = "Your order has been placed successfully!";
                    break;
                case "order is ready for delivery":
                    statusMessage = "Your order is ready and will be dispatched shortly!";
                    break;
                case "out for delivery":
                    statusMessage = "Your order is out for delivery. Please be ready to receive it.";
                    break;
                case "delivered":
                    statusMessage = "Your order has been delivered. Thank you for choosing us!";
                    break;
                case "cancelled":
                    statusMessage = "Your order has been cancelled. Contact us if this was a mistake.";
                    break;
                default:
                    statusMessage = `Your order status has been updated to: ${req.body.orderStatus}.`;
            }

            mailer.sendMail(
                {
                    from:    process.env.MAIL_SENDER,
                    to:      finalData.user.email,
                    subject: `Order Status Updated - Team ${process.env.SITE_NAME}`,
                    html: `
                        <div style="font-family:Arial,sans-serif;padding:20px;background-color:#f9f9f9;">
                            <h2 style="color:#28a745;">Hello ${finalData.user.name},</h2>
                            <p style="color:#555;">${statusMessage}</p>
                            <p style="color:#555;">
                                If you have any questions, please
                                <a href="${process.env.SERVER}/contact" style="color:#007bff;">contact us</a>.
                            </p>
                            <p style="color:#555;">Best Regards,<br>Team ${process.env.SITE_NAME}</p>
                        </div>
                    `,
                },
                (err) => { if (err) console.error("Email error:", err); }
            );
        }

        res.send({ result: "Done", data: finalData });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
async function deleteRecord(req, res) {
    try {
        const data = await MedicineCheckout.findOne({ _id: req.params._id });
        if (data) {
            await data.deleteOne();
            res.send({ result: "Done", data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    getUserRecord,
    deleteRecord,
    // FIX: order and verifyOrder were defined but commented out in exports
    // Payment.jsx calls POST /api/medicineCheckout/order and /verify — these MUST be exported
    order,
    verifyOrder,
};