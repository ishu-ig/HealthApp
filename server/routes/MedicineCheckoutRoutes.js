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
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");

MedicineCheckoutRouter.post("/order",verifyBoth,        order);          // Razorpay: create order
MedicineCheckoutRouter.post("/verify",verifyBoth,       verifyOrder);    // Razorpay: verify payment
MedicineCheckoutRouter.post("",verifyBoth,              createRecord);
MedicineCheckoutRouter.get("", verifyAdmin,             getRecord);
MedicineCheckoutRouter.get("/user/:userid",verifyBoth, getUserRecord);
MedicineCheckoutRouter.get("/single/:_id",verifyBoth,  getSingleRecord);
MedicineCheckoutRouter.put("/:_id",verifyBoth,         updateRecord);
MedicineCheckoutRouter.delete("/:_id",verifyBoth,      deleteRecord);

module.exports = MedicineCheckoutRouter;