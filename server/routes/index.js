const Router = require("express").Router()

const DoctorRouter            = require("./DotorRoutes")
const LabtestCategoryRouter   = require("./LabtestCategoryRoutes copy")
const LabtestRouter           = require("./LabtestRoutes")
const MedicineCartRouter      = require("./MedicineCartRoutes")
const MedicineCategoryRouter  = require("./MedicineCategoryRoutes")
const MedicineRouter          = require("./MedicineRoutes")
const SpecilizationRouter     = require("./SpecializationRoutes")
const LabtestCartRouter       = require("./LabtestCartRoutes")
const NewsletterRouter        = require("./NewsletterRoutes")
const LabtestBookingRouter    = require("./LabtestBookingRoutes")
const TestimonialRouter       = require("./TestimonialRoutes")
const HospitalRouter          = require("./HospitalRoutes")
const ContactUsRouter         = require("./ContactUsRouter")
const UserRouter              = require("./UserRouter")
const NurseRouter             = require("./NurseRoutes")
const ManufacturerRouter      = require("./ManufacturerRoutes")
const LabRouter               = require("./LabRoutes")
const MedicineCheckoutRouter  = require("./MedicineCheckoutRoutes")
const LabtestCheckoutRouter   = require("./LabtestCheckoutRoutes")
const MedicineWishlistRouter  = require("./MedicineWishlistRoutes") // ✅ Fix: was importing MODEL
const LabtestWishlistRouter   = require("./LabtestWishlistRouter")  // ✅ Fix: was importing MODEL
const DoctorAppointmentRouter = require("./DoctorAppointmentRoutes")
const NurseAppointmentRouter = require("./NurseAppointmentRoutes")

Router.use("/specialization",   SpecilizationRouter)
Router.use("/hospital",         HospitalRouter)
Router.use("/medicineCategory", MedicineCategoryRouter)
Router.use("/labtestCategory",  LabtestCategoryRouter)
Router.use("/medicine",         MedicineRouter)
Router.use("/labtest",          LabtestRouter)
Router.use("/doctor",           DoctorRouter)
Router.use("/nurse",            NurseRouter)
Router.use("/medicineCart",     MedicineCartRouter)
Router.use("/labtestCart",      LabtestCartRouter)
Router.use("/medicineCheckout", MedicineCheckoutRouter)
Router.use("/labtestCheckout",  LabtestCheckoutRouter)
Router.use("/newsletter",       NewsletterRouter)
Router.use("/labtestbooking",   LabtestBookingRouter)
Router.use("/testimonial",      TestimonialRouter)
Router.use("/contactus",        ContactUsRouter)
Router.use("/user",             UserRouter)
Router.use("/manufacturer",     ManufacturerRouter)
Router.use("/lab",              LabRouter)
Router.use("/medicineWishlist", MedicineWishlistRouter) // ✅ Fix
Router.use("/labtestWishlist",  LabtestWishlistRouter)  // ✅ Fix
Router.use("/doctorAppointment",  DoctorAppointmentRouter)  // ✅ Fix
Router.use("/nurseAppointment",  NurseAppointmentRouter)  // ✅ Fix


module.exports = Router