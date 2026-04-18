const mongoose = require("mongoose")

const LabtestCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Labtest Category Is Mendatory"]
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

const LabtestCategory = new mongoose.model("LabtestCategory", LabtestCategorySchema)
module.exports = LabtestCategory