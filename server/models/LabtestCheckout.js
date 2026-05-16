const mongoose = require("mongoose")

// FIX: model was registered as "LabtestCart" — same name as LabtestCart.js.
// Mongoose throws "Cannot overwrite `LabtestCart` model once compiled."
// Correct model name is "LabtestCheckout".
const LabtestCheckoutSchema = new mongoose.Schema({
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
   // FIX: was "deliveryStatus: Number" — this field represents a charge,
   // not a status string. Renamed to deliveryCharge for clarity.
   deliveryCharge: {
      type: Number,
      default: 0
   },
   total: {
      type: Number,
      required: [true, "Total Field is Mendatory"]
   },
   rppid: {
      type: String,
      default: ""
   },
   reservationDate: {
      type: Date,
      default: null
   },
   tester:{
      type:mongoose.Schema.Types.ObjectId,
      default:null
   },
   labtests: []
}, { timestamps: true })

const LabtestCheckout = new mongoose.model("LabtestCheckout", LabtestCheckoutSchema)
module.exports = LabtestCheckout