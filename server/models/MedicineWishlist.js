const mongoose = require("mongoose")

const MedicineWishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Mendatory"]
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: [true, "Product Id is Mendatory"]
    }
})
const MedicineWishlist = new mongoose.model("MedicineWishlist", MedicineWishlistSchema)

module.exports = MedicineWishlist