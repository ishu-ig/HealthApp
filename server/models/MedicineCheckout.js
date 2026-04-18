const mongoose = require("mongoose")

const MedicineCheckoutSchema = new mongoose.Schema({
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
   shipping: {
      type: Number,
      required: [true, "Shipping Field is Mendatory"]
   },
   total: {
      type: Number,
      required: [true, "Total Field is Mendatory"]
   },
   rppid: {
      type: String,
      default: ""
   },
   medicines: []
}, { timestamps: true })

const MedicineCheckout = new mongoose.model("MedicineCheckout", MedicineCheckoutSchema)
module.exports = MedicineCheckout