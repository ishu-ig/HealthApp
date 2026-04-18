const mongoose = require("mongoose");

const ManufacturerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Manufacturer name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
    },

    gstNumber: {
      type: String,
      required: [true, "GST number is required"],
    },
    establishedYear: {
      type: Number,
    },

    website: {
      type: String,
    },

    certifications: [
      {
        type: String, // Example: ISO, WHO-GMP, FDA
      },
    ],
    active: {
        type: Boolean,
        default: true
    },
    address:{
        type:String,
        required:[true,"Address is Mendatory"]
    },
    city:{
        type:String,
        required:[true,"City is Mendatory"]
    },
    state:{
        type:String,
        required:[true,"State is Mendatory"]
    },
    pincode:{
        type:String,
        required:[true,"Pincode is Mendatory"]
    },
    country:{
        type:String,
        required:[true,"Country is Mendatory"]
    }
},{timestamps:true});

const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);

module.exports = Manufacturer;
