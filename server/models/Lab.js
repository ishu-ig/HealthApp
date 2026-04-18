const mongoose = require("mongoose")

const LabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lab Name Is Mendatory"]
    },

    pic: {
        type: String,
        required: [true, "Pic is Mendatory"]
    },

    availableDays: {
        type: [String],
        required: [true, "Available Days is mandatory"]
    },
    
    openingTime: {
        type: String,
        required: [true, "Open Time Is Mendatory"]
    },
    closingTime: {
        type: String,
        required: [true, "Close Time Is Mendatory"]
    },
    address: {
        type: String,
        required: [true, "Address Is Mendatory"]
    },
    pincode: {
        type: Number,
        required: [true, "Pincode Is Mendatory"]
    },
    city: {
        type: String,
        required: [true, "City Is Mendatory"]
    },
    state: {
        type: String,
        required: [true, "State Is mendatory"]
    },

    active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })
const Lab = new mongoose.model("Lab", LabSchema)

module.exports = Lab

