const LabtestBookingRouter = require("express").Router()
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/LabtestBookingController")

LabtestBookingRouter.post("", createRecord)
LabtestBookingRouter.get("", getRecord)
LabtestBookingRouter.get("/user/:userid", getUserRecord)
LabtestBookingRouter.get("/single/:_id", getSingleRecord)
LabtestBookingRouter.put("/:_id", updateRecord)
LabtestBookingRouter.delete("/:_id", deleteRecord)


module.exports = LabtestBookingRouter