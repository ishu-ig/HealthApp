const MedicineCartRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/MedicineCartController");
const { verifyBoth } = require("../middleware/authorization");



MedicineCartRouter.post("",verifyBoth, createRecord);
MedicineCartRouter.get("/:userid",verifyBoth, getRecord),
MedicineCartRouter.get("/:_id",verifyBoth, getSingleRecord),
MedicineCartRouter.put("/:_id",verifyBoth, updateRecord),
MedicineCartRouter.delete("/:_id",verifyBoth, deleteRecord)

module.exports = MedicineCartRouter