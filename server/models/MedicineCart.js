const mongoose = require("mongoose")

const MedicineCartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Mendatory"]
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: [true, "Medicine Id is Mendatory"]
    },
    qty: {
        type: Number,
        required: [true, "Quantity is Mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Price is Mendatory"]
    }
})
const MedicineCart = new mongoose.model("MedicineCart", MedicineCartSchema)

module.exports = MedicineCart