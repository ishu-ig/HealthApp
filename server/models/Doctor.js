const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Doctor Name is mandatory"]
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
        type: Date,
        required: [true, "Date Of Birth is mandatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic is mandatory"]
    },
    specialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialization",
    },
    availableDays: [{
        type: String,
        required: [true, "Days are mandatory"]
    }],
    bio: {
        type: String,
        required: [true, "Bio is mandatory"]
    },
    qualification: {
        type: String,
        required: [true, "Qualification is mandatory"]
    },
    experience: {
        type: Number,
        required: [true, "Experience is mandatory"]
    },
    availableTime: {
        type: Object,
        required: [true, "Timing is mandatory"]
    },
    hospital: {
        type: mongoose.Types.ObjectId,
        ref:"Hospital",
    },
    fees: {
        type: Number,
        required: [true, "Fees are mandatory"]
    },
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
    }
},{timestamps:true});

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
