const mongoose = require("mongoose");

const SpecializationSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Specialization Name Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true,
    }
})

const Specialization = new mongoose.model("Specialization", SpecializationSchema)
module.exports = Specialization