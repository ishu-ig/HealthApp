const mongoose = require("mongoose");

const NurseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nurse Name is mandatory"]
    },
    email: {
        type: String,
        required: [true, "Email Address is mandatory"]
    },
    phone: {
        type: Number,
        required: [true, "Contact Number is mandatory"]
    },
    gender: {
        type: String,
        required: [true, "Gender is mandatory"]
    },
    dob: {
        type: String,
        required: [true, "Date Of Birth is mandatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic is mandatory"]
    },
    availableTime: {
        type: String,
        required: [true, "Open Timing are mandatory"]
    },
    bio: {
        type: String,
        required: [true, "Bio is mandatory"]
    },
    qualification: {
        type: String,
        required: [true, "Qualification is mandatory"]
    },
    address: {
        type: String,
        required: [true, "Address is mandatory"]
    },
    state: {
        type: String,
        required: [true, "State is mandatory"]
    },
    city: {
        type: String,
        required: [true, "City is mandatory"]
    },
    pincode: {
        type: String,
        required: [true, "Pincode is mandatory"]
    },
    experience: {
        type: Number,
        required: [true, "Experience is mandatory"]
    },
    availableDays: [{
        type: String,
        required: [true, "Available Days is mandatory"]
    }],
    hospital: {
        type: mongoose.Types.ObjectId,
        ref:"Hospital",
        default: ""
    },
    departments: [{
    type: String
  }], 
    fees: {
        type: Number,
        required: [true, "Fees are mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
},{timestamps:true});

const Nurse = mongoose.model("Nurse", NurseSchema);

module.exports = Nurse;
