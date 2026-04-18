const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hospital name is required"],
    trim: true,
    unique:true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"]
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  city: {
    type: String,
    required: [true, "City is required"]
  },
  state: {
    type: String,
    required: [true, "State is required"]
  },
  pincode: {
    type: String,
    required: [true, "PIN code is required"]
  },
  establishYear: {
    type: Number,
    required: [true, "Establishment Year is required"]

  },
  departments: [{
    type: String
  }],
  pic: {
    type: String, // path to logo/image
    required:[true ,"Pic Is Mendatory"]
  },
  accreditation: {
    type: String, // e.g., NABH, JCI
    required:[true ,"Accredation Is Mendatory"]
  },
  emergencyContact: {
    type: String,
    required:[true ,"Emergency Contact Number Is Mendatory"]
  },
  active: {
    type: Boolean,
    default: true
  },
},{timestamps:true });

const Hospital = mongoose.model("Hospital", HospitalSchema);

module.exports = Hospital;
