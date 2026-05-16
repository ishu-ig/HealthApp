const LabtestCheckoutRouter = require("express").Router()
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    // FIX: order and verifyOrder were missing from this router entirely.
    // The frontend Payment component POSTs to /api/labtestCheckout/order and /verify.
    order,
    verifyOrder,
} = require("../controllers/LabtestCheckoutController")
const { verifyAdmin, verifyBoth } = require("../middleware/authorization")

LabtestCheckoutRouter.post("/order", verifyBoth,       order)         // Razorpay: create order
LabtestCheckoutRouter.post("/verify",verifyBoth,       verifyOrder)   // Razorpay: verify payment
LabtestCheckoutRouter.post("",verifyBoth,              createRecord)
LabtestCheckoutRouter.get("",verifyAdmin,            getRecord)
LabtestCheckoutRouter.get("/user/:userid", getUserRecord)
LabtestCheckoutRouter.get("/single/:_id",  getSingleRecord)
LabtestCheckoutRouter.put("/:_id",verifyBoth,         updateRecord)
LabtestCheckoutRouter.delete("/:_id",verifyBoth,      deleteRecord)

module.exports = LabtestCheckoutRouter