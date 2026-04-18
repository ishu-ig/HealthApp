const mongoose = require("mongoose")

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Medicine Name Is Mendatory"]
    },
    medicineCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicineCategory",
        required: [true, "Medicine category Id is Mendatory"]
    },
    pic: [
        {
            type: String
        }
    ],
    description: {
        type: String,
        required: [true, "Description Is Mendatory"]
    },
    basePrice: {
        type: Number,
        required: [true, "Price Is mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Discount is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Final Price is Mendatory"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Stock Quantity is Mendatory"]
    },
    expireDate: {
        type: String,
        required: [true, "Expire date Is Mendatory"]
    },
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
    },
    active: {
        type: Boolean,
        default: true
    },
})
const Medicine = new mongoose.model("Medicine", MedicineSchema)

module.exports = Medicine

