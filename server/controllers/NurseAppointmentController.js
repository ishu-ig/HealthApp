const NurseAppointment = require("../models/NurseAppointment")
const Razorpay = require("razorpay")
const mailer   = require("../mailer/index")

// ─── Razorpay Order ───────────────────────────────────────────────────────────
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id:     process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        instance.orders.create({ amount: req.body.amount * 100, currency: "INR" }, (error, order) => {
            if (error) return res.status(500).json({ message: "Something Went Wrong!" });
            res.json({ data: order });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

// ─── Verify Razorpay Payment ──────────────────────────────────────────────────
async function verifyOrder(req, res) {
    try {
        let check = await NurseAppointment.findOne({ _id: req.body.checkid })
        check.rppid         = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode   = "Net Banking"
        await check.save()
        res.send({ result: "Done", message: "Payment Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

// ─── Shared populate helper ───────────────────────────────────────────────────
function populateAppointment(query) {
    return query
        .populate("user",     ["name", "email", "phone", "address", "city", "state", "pincode"])
        // ✅ Fix: populate correct nurse fields that exist in Nurse schema
        .populate("nurse",    ["name", "fees", "phone", "email", "availableTime", "departments", "hospital"])
        .populate("hospital", ["name", "address", "phone"])
}

// ─── Create ───────────────────────────────────────────────────────────────────
async function createRecord(req, res) {
    try {
        let data = new NurseAppointment(req.body);
        await data.save();

        let finalData = await populateAppointment(
            NurseAppointment.findOne({ _id: data._id })
        );

        // ✅ Fix: was checking finalData.NurseAppointmentStatus (wrong field name)
        if (finalData.appointmentStatus) {
            mailer.sendMail({
                from:    process.env.MAIL_SENDER,
                to:      finalData.user.email,
                subject: `Appointment Confirmation - Team ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                                background-color: #f9f9f9; padding: 20px; border-radius: 10px;
                                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #28a745; text-align: center;">Appointment Confirmed 🎉</h2>
                        <p style="color: #555; font-size: 16px; text-align: center;">
                            Your nurse appointment has been <strong>confirmed</strong>!
                        </p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 8px;
                                    margin-top: 15px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; margin: 8px 0;">
                                <!-- ✅ Fix: was "Restaurant" and finalData.nurse.name — corrected label -->
                                <strong>Nurse:</strong> ${finalData.nurse?.name || "N/A"}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <strong>Hospital:</strong> ${finalData.hospital?.name || "N/A"}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <!-- ✅ Fix: was "Seats Reserved" with finalData.fees -->
                                <strong>Fees:</strong> ₹${finalData.fees}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <!-- ✅ Fix: format date properly -->
                                <strong>Date:</strong> ${new Date(finalData.date).toLocaleDateString()}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <strong>Service:</strong> ${finalData.serviceType}
                            </p>
                        </div>
                        <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
                            If you have any questions, please
                            <a href="${process.env.SERVER}/contact" style="color: #007bff;">contact us</a>.
                        </p>
                        <p style="color: #555; text-align: center; margin-top: 10px;">
                            Best Regards,<br><strong>Team ${process.env.SITE_NAME}</strong>
                        </p>
                    </div>
                `,
            }, (err) => {
                if (err) console.log("Email error:", err);
                else console.log("Confirmation email sent.");
            });
        }

        res.send({ result: "Done", data: finalData });

    } catch (error) {
        let errorMessage = {};
        if (error.errors?.user)            errorMessage.user            = error.errors.user.message;
        if (error.errors?.nurse)           errorMessage.nurse           = error.errors.nurse.message;
        if (error.errors?.date)            errorMessage.date            = error.errors.date.message;
        if (error.errors?.fees)            errorMessage.fees            = error.errors.fees.message;
        if (error.errors?.serviceType)     errorMessage.serviceType     = error.errors.serviceType.message;
        if (error.errors?.paymentStatus)   errorMessage.paymentStatus   = error.errors.paymentStatus.message;
        if (error.errors?.paymentMode)     errorMessage.paymentMode     = error.errors.paymentMode.message;

        if (Object.keys(errorMessage).length > 0) {
            res.status(400).send({ result: "Fail", reason: errorMessage });
        } else {
            console.log(error);
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        }
    }
}

// ─── Get All (Admin) ──────────────────────────────────────────────────────────
async function getRecord(req, res) {
    try {
        let data = await populateAppointment(
            NurseAppointment.find().sort({ _id: -1 })
        );
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Get by User ──────────────────────────────────────────────────────────────
async function getUserRecord(req, res) {
    try {
        let data = await populateAppointment(
            NurseAppointment.find({ user: req.params.userid }).sort({ _id: -1 })
        );
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Get Single ───────────────────────────────────────────────────────────────
async function getSingleRecord(req, res) {
    try {
        let data = await populateAppointment(
            NurseAppointment.findOne({ _id: req.params._id })
        );
        if (data)
            res.send({ result: "Done", data });
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ─── Update ───────────────────────────────────────────────────────────────────
async function updateRecord(req, res) {
    try {
        let data = await NurseAppointment.findOne({ _id: req.params._id });
        if (!data) return res.status(404).send({ result: "Fail", reason: "Record Not Found" });

        data.paymentMode       = req.body.paymentMode       ?? data.paymentMode;
        data.paymentStatus     = req.body.paymentStatus     ?? data.paymentStatus;
        // ✅ Fix: was updating "NurseAppointmentStatus" — correct field is "appointmentStatus"
        data.appointmentStatus = req.body.appointmentStatus ?? data.appointmentStatus;
        data.status            = req.body.status            ?? data.status;
        data.appointmentTime   = req.body.appointmentTime   ?? data.appointmentTime; // set time on update
        data.rppid             = req.body.rppid             ?? data.rppid;
        data.reportingTime    = req.body.reportingTime    ?? data.reportingTime
        await data.save();

        let finalData = await populateAppointment(
            NurseAppointment.findOne({ _id: data._id })
        );

        // ✅ Fix: was checking NurseAppointmentStatus === "false" (string on boolean)
        // and using finalData.resturent.name (leftover restaurant code)
        if (finalData.status === "Cancelled") {
            mailer.sendMail({
                from:    process.env.MAIL_SENDER,
                to:      finalData.user.email,
                subject: `Appointment Cancellation - Team ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                                background-color: #f9f9f9; padding: 20px; border-radius: 10px;
                                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #dc3545; text-align: center;">Appointment Cancelled 😞</h2>
                        <p style="color: #555; font-size: 16px; text-align: center;">
                            Your nurse appointment has been <strong>cancelled</strong>.
                        </p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 8px;
                                    margin-top: 15px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px; margin: 8px 0;">
                                <!-- ✅ Fix: was finalData.resturent.name -->
                                <strong>Nurse:</strong> ${finalData.nurse?.name || "N/A"}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <strong>Hospital:</strong> ${finalData.hospital?.name || "N/A"}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <!-- ✅ Fix: was finalData.seats -->
                                <strong>Fees:</strong> ₹${finalData.fees}
                            </p>
                            <p style="font-size: 16px; margin: 8px 0;">
                                <strong>Date:</strong> ${new Date(finalData.date).toLocaleDateString()}
                            </p>
                        </div>
                        <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
                            To rebook, visit
                            <a href="${process.env.SERVER}/nurse" style="color: #007bff;">our nurses page</a>.
                        </p>
                        <p style="color: #555; text-align: center; margin-top: 10px;">
                            Best Regards,<br><strong>Team ${process.env.SITE_NAME}</strong>
                        </p>
                    </div>
                `,
            }, (err) => {
                if (err) console.log("Email error:", err);
                else console.log("Cancellation email sent.");
            });
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
        let data = await NurseAppointment.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
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
    order,
    verifyOrder,
}