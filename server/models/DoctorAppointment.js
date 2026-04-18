const mongoose = require("mongoose");

const DoctorAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is mandatory"],
    },

    // ✅ Fix: doctor field was completely missing from schema
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is mandatory"],
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    serviceType: {
      type: String,
      default: "Consultation",
    },

    date: {
      type: Date,
      required: [true, "Date is mandatory"],
    },

    appointmentTime: {
      type: String,
      default: "",
    },

    reportingTime:{
        type:String,
        default:"",
    },

    appointmentMode: {
      type: String,
      enum: ["Offline", "Online", "Chat"],
      default: "Offline",
    },

    fees: {
      type: Number,
      required: [true, "Fees are mandatory"],
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    appointmentStatus: {
      type: Boolean,
      default: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Done", "Failed"],  // ✅ Fix: was "Paid" but controller sets "Done"
      default: "Pending",
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "Net Banking"],        // ✅ Fix: was "Online" but frontend sends "Cash"/"Net Banking"
      default: "Cash",
    },

    rppid: {
      type: String,                         // Razorpay payment id
      default: "",
    },
  },
  { timestamps: true }
);

const DoctorAppointment = mongoose.model("DoctorAppointment", DoctorAppointmentSchema);
module.exports = DoctorAppointment;