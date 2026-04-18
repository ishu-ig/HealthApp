const DoctorAppointmentRouter = require("express").Router()


const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
    getUserRecord,
    order,
    verifyOrder
} = require("../controllers/DoctorAppointmentController");



DoctorAppointmentRouter.post("" ,createRecord);
DoctorAppointmentRouter.get("",  getRecord);
DoctorAppointmentRouter.get("/user/:userid", getUserRecord);
DoctorAppointmentRouter.get("/single/:_id", getSingleRecord);
DoctorAppointmentRouter.put("/:_id", updateRecord);
DoctorAppointmentRouter.delete("/:_id", deleteRecord);
DoctorAppointmentRouter.post("/order", order);
DoctorAppointmentRouter.post("/verify", verifyOrder);

module.exports = DoctorAppointmentRouter