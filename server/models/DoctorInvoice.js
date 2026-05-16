const mongoose = require("mongoose")

const DoctorInvoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DoctorAppointment",
            required: [true, "Order reference is required"],
            unique: true   // one invoice per order
        },
        invoiceNumber: {
            type: String,
            required: [true, "Invoice number is required"],
            unique: true,
            trim: true
        }
    },
    { timestamps: true }
)

const DoctorInvoice = mongoose.model("DoctorInvoice", DoctorInvoiceSchema)

module.exports = DoctorInvoice