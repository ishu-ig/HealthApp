const mongoose = require("mongoose");

const nurseAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is mandatory"],
    },

    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nurse",
      required: [true, "Nurse is mandatory"],
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    // ✅ Fix: made optional — frontend doesn't send this on booking
    serviceType: {
      type: String,
      enum: ["Injection", "Dressing", "Elder Care", "Home Care", "Other"],
      default: "Other",               // ✅ Fix: was required with no default — caused 400 on create
    },

    date: {
      type: Date,
      required: [true, "Date is mandatory"],
    },

    appointmentTime: {
      type: String,
      default: "",                    // ✅ Fix: set on update not create
    },

      reportingTime:{
        type:String,
        default:"",
    },

    duration: {
      type: Number,
      default: 1,
    },

    // ✅ Fix: made optional — address fetched from user profile, not sent by frontend
    address: {
      type: String,
      default: "",
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
      enum: ["Pending", "Done", "Failed"],  // ✅ Fix: was "Paid" but verifyOrder sets "Done"
      default: "Pending",
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "Net Banking"],        // ✅ Fix: was "Online" but frontend sends "Cash"/"Net Banking"
      default: "Cash",
    },

    rppid: {
      type: String,                         // ✅ Fix: was "paymentId" but controller uses "rppid"
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Fix: index used wrong field "appointmentDate" — schema field is "date"
nurseAppointmentSchema.index(
  { nurse: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("NurseAppointment", nurseAppointmentSchema);