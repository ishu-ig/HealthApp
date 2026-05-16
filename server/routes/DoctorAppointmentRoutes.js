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
const { verifyBoth, verifyAdmin } = require("../middleware/authorization");



DoctorAppointmentRouter.post("" , verifyBoth, createRecord);
DoctorAppointmentRouter.get("", verifyAdmin, getRecord);
DoctorAppointmentRouter.get("/user/:userid",verifyBoth, getUserRecord);
DoctorAppointmentRouter.get("/single/:_id",verifyBoth, getSingleRecord);
DoctorAppointmentRouter.put("/:_id",verifyBoth, updateRecord);
DoctorAppointmentRouter.delete("/:_id",verifyBoth, deleteRecord);
DoctorAppointmentRouter.post("/order",verifyBoth, order);
DoctorAppointmentRouter.post("/verify",verifyBoth, verifyOrder);

module.exports = DoctorAppointmentRouter