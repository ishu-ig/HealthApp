const mongoose = require("mongoose")

const MedicineInvoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicineCheckout",
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

const MedicineInvoice = mongoose.model("MedicineInvoice", MedicineInvoiceSchema)

module.exports = MedicineInvoice