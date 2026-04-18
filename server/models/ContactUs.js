const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Mendatory"]
    },
    email: {
        type: String,
        required: [true, "Email Is Mendatory"]
    },
    phone: {
        type: Number,
        required: [true, "Contact Number Is Mendatory"]
    },
    subject: {
        type: String,
        required: [true, "Subject Is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const ContactUs = new mongoose.model("ContactUs", ContactUsSchema)

module.exports = ContactUs 