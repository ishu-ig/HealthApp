const LabtestCheckout = require("../models/LabtestCheckout")
const Razorpay = require("razorpay")
const mailer   = require("../mailer/index")

// FIX: removed wrong food-delivery populate (products.product / maincategory / resturent)
// LabtestCheckout only has a "user" ref; labtests[] is a plain embedded array.
function buildQuery(query) {
    return query.populate(
        "user",
        ["name", "username", "email", "phone", "state", "city", "pin", "address"]
    )
}

async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id:     process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        })
        instance.orders.create({ amount: req.body.amount * 100, currency: "INR" }, (error, razorOrder) => {
            if (error) return res.status(500).json({ message: "Something went wrong with Razorpay." })
            res.json({ data: razorOrder })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

async function verifyOrder(req, res) {
    try {
        const check = await LabtestCheckout.findOne({ _id: req.body.checkid })
        if (!check) return res.status(404).send({ result: "Fail", reason: "Order not found" })
        check.rppid         = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode   = "Net Banking"
        await check.save()
        res.send({ result: "Done", message: "Payment successful" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

async function createRecord(req, res) {
    try {
        const doc = new LabtestCheckout(req.body)
        await doc.save()
        const finalData = await buildQuery(LabtestCheckout.findOne({ _id: doc._id }))
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        const errorMessage = {}
        if (error.errors?.user)     errorMessage.user     = error.errors.user.message
        if (error.errors?.subtotal) errorMessage.subtotal = error.errors.subtotal.message
        if (error.errors?.total)    errorMessage.total    = error.errors.total.message
        if (Object.keys(errorMessage).length === 0) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage })
        }
    }
}

async function getRecord(req, res) {
    try {
        const data = await buildQuery(LabtestCheckout.find().sort({ _id: -1 }))
        res.send({ result: "Done", count: data.length, data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getUserRecord(req, res) {
    try {
        const data = await buildQuery(
            LabtestCheckout.find({ user: req.params.userid }).sort({ _id: -1 })
        )
        res.send({ result: "Done", count: data.length, data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await buildQuery(LabtestCheckout.findOne({ _id: req.params._id }))
        if (data) res.send({ result: "Done", data })
        else res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        const doc = await LabtestCheckout.findOne({ _id: req.params._id })
        if (!doc) return res.status(404).send({ result: "Fail", reason: "Record Not Found" })

        const previousOrderStatus = doc.orderStatus
        doc.orderStatus   = req.body.orderStatus   ?? doc.orderStatus
        doc.paymentMode   = req.body.paymentMode   ?? doc.paymentMode
        doc.paymentStatus = req.body.paymentStatus ?? doc.paymentStatus
        doc.rppid         = req.body.rppid         ?? doc.rppid
        await doc.save()

        const finalData = await buildQuery(LabtestCheckout.findOne({ _id: doc._id }))

        // FIX: switch cases now use lowercase comparison (original never matched)
        if (req.body.orderStatus && req.body.orderStatus !== previousOrderStatus) {
            let statusMessage = `Your booking status has been updated to: ${req.body.orderStatus}.`
            switch (req.body.orderStatus.toLowerCase()) {
                case "order is placed":         statusMessage = "Your lab test booking is placed!"; break
                case "order is under process":  statusMessage = "Your booking is under process."; break
                case "sample collection scheduled": statusMessage = "Sample collection visit scheduled."; break
                case "sample collected":        statusMessage = "Sample collected and sent to lab."; break
                case "report ready":            statusMessage = "Your report is ready. Check your account."; break
                case "cancelled":               statusMessage = "Your booking has been cancelled."; break
            }
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to:   finalData.user.email,
                subject: `Lab Booking Update - ${process.env.SITE_NAME}`,
                html: `<div style="font-family:Arial,sans-serif;padding:20px">
                    <h2 style="color:#06A3DA">Hello ${finalData.user.name},</h2>
                    <p>${statusMessage}</p>
                    <p>Best Regards,<br>Team ${process.env.SITE_NAME}</p>
                </div>`,
            }, (err) => { if (err) console.error("Email error:", err) })
        }

        res.send({ result: "Done", data: finalData })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await LabtestCheckout.findOne({ _id: req.params._id })
        if (data) { await data.deleteOne(); res.send({ result: "Done", data }) }
        else res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    createRecord, getRecord, getSingleRecord, updateRecord,
    getUserRecord, deleteRecord,
    // FIX: these were commented out — routes POST /order and /verify need them
    order, verifyOrder,
}