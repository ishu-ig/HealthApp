const NurseAppointmentRouter = require("express").Router()


const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
    getUserRecord,
    order,
    verifyOrder
} = require("../controllers/NurseAppointmentController");



NurseAppointmentRouter.post("" ,createRecord);
NurseAppointmentRouter.get("",  getRecord);
NurseAppointmentRouter.get("/user/:userid", getUserRecord);
NurseAppointmentRouter.get("/single/:_id", getSingleRecord);
NurseAppointmentRouter.put("/:_id", updateRecord);
NurseAppointmentRouter.delete("/:_id", deleteRecord);
NurseAppointmentRouter.post("/order", order);
NurseAppointmentRouter.post("/verify", verifyOrder);

module.exports = NurseAppointmentRouter