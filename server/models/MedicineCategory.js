const mongoose = require("mongoose")

const MedicineCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Medicine Category Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

const MedicineCategory = new mongoose.model("MedicineCategory", MedicineCategorySchema)
module.exports = MedicineCategory