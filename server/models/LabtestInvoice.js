const mongoose = require("mongoose")

const ProductInvoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LabtestCheckout",
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

const Invoice = mongoose.model("Invoice", ProductInvoiceSchema)

module.exports = Invoice