const mongoose = require("mongoose")

const NurseInvoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NurseAppointment",
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

const NurseInvoice = mongoose.model("NurseInvoice", NurseInvoiceSchema)

module.exports = NurseInvoice