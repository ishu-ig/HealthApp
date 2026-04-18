const mongoose = require("mongoose")

const LabtestCartSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id Is Mendatory"]
   },
   orderStatus: {
      type: String,
      default: "Order is Placed"
   },
   paymentMode: {
      type: String,
      default: "COD"
   },
   paymentStatus: {
      type: String,
      default: "Pending"
   },
   subtotal: {
      type: Number,
      required: [true, "Subtotal Field is Mendatory"]
   },
   deliveryStatus: {
      type: Number,
      required: [true, "Delivery Status Field is Mendatory"]
   },
   total: {
      type: Number,
      required: [true, "Total Field is Mendatory"]
   },
   rppid: {
      type: String,
      default: ""
   },
   labtests: []
}, { timestamps: true })

const LabtestCart = new mongoose.model("LabtestCart", LabtestCartSchema)
module.exports = LabtestCart