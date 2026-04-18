const MedicineCheckoutRouter = require("express").Router();
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    // FIX: these were missing from the router entirely —
    // Payment.jsx POSTs to /api/medicineCheckout/order and /api/medicineCheckout/verify
    order,
    verifyOrder,
} = require("../controllers/MedicineCheckoutController");

MedicineCheckoutRouter.post("/order",        order);          // Razorpay: create order
MedicineCheckoutRouter.post("/verify",       verifyOrder);    // Razorpay: verify payment
MedicineCheckoutRouter.post("",              createRecord);
MedicineCheckoutRouter.get("",              getRecord);
MedicineCheckoutRouter.get("/user/:userid", getUserRecord);
MedicineCheckoutRouter.get("/single/:_id",  getSingleRecord);
MedicineCheckoutRouter.put("/:_id",         updateRecord);
MedicineCheckoutRouter.delete("/:_id",      deleteRecord);

module.exports = MedicineCheckoutRouter;