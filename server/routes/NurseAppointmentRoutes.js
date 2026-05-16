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
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



NurseAppointmentRouter.post("" ,verifyBoth,createRecord);
NurseAppointmentRouter.get("",verifyAdmin,  getRecord);
NurseAppointmentRouter.get("/user/:userid",verifyBoth, getUserRecord);
NurseAppointmentRouter.get("/single/:_id",verifyBoth, getSingleRecord);
NurseAppointmentRouter.put("/:_id",verifyBoth, updateRecord);
NurseAppointmentRouter.delete("/:_id",verifyBoth, deleteRecord);
NurseAppointmentRouter.post("/order",verifyBoth, order);
NurseAppointmentRouter.post("/verify",verifyBoth, verifyOrder);

module.exports = NurseAppointmentRouter