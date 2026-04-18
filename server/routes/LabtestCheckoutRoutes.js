const LabtestCheckoutRouter = require("express").Router()
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/LabtestCheckoutController")

LabtestCheckoutRouter.post("", createRecord)
LabtestCheckoutRouter.get("", getRecord)
LabtestCheckoutRouter.get("/user/:userid", getUserRecord)
LabtestCheckoutRouter.get("/single/:_id", getSingleRecord)
LabtestCheckoutRouter.put("/:_id", updateRecord)
LabtestCheckoutRouter.delete("/:_id", deleteRecord)


module.exports = LabtestCheckoutRouter