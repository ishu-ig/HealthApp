const mongoose = require("mongoose")

const LabtestBookingSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id Is Mendatory"]
   },
   BookingStatus: {
      type: String,
      default: "Confirm"
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
   visitingCharge: {
      type: Number,
      required: [true, "Visiting Field is Mendatory"]
   },
   date:{
      type:String,
      required:[true,"Appointment Date Is required"]
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

const LabtestBooking = new mongoose.model("LabtestBooking", LabtestBookingSchema)
module.exports = LabtestBooking