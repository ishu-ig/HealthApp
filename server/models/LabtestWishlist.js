const mongoose = require("mongoose")

const LabtestWishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Mendatory"]
    },
    labtest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Labtest",
        required: [true, "Product Id is Mendatory"]
    }
})
const LabtestWishlist = new mongoose.model("LabtestWishlist", LabtestWishlistSchema)

module.exports = LabtestWishlist