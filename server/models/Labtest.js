const mongoose = require("mongoose")

const LabtestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Labtest Name Is Mandatory"]
    },
    labtestCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabtestCategory",
        required: [true, "Labtest Category Is Mandatory"]
    },
    // ✅ lab as ObjectId ref instead of labName string
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lab",
        required: [true, "Lab Is Mandatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic Is Mandatory"]
    },
    description: {
        type: String,
        required: [true, "Description Is Mandatory"]
    },
    sampleRequired: {
        type: String,
        required: [true, "Sample Is Mandatory"]
    },
    preperation: {
        type: String,
    },
    reportTime: {
        type: String,
        required: [true, "Report Time Is Mandatory"]
    },
    basePrice: {
        type: Number,
        required: [true, "Price Is Mandatory"]
    },
    discount: {
        type: Number,
        required: [true, "Discount Is Mandatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Final Price Is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})

const Labtest = new mongoose.model("Labtest", LabtestSchema)
module.exports = Labtest