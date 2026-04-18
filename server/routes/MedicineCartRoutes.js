const MedicineCartRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/MedicineCartController");



MedicineCartRouter.post("", createRecord);
MedicineCartRouter.get("", getRecord),
MedicineCartRouter.get("/:_id", getSingleRecord),
MedicineCartRouter.put("/:_id", updaterecord),
MedicineCartRouter.delete("/:_id", deleteRecord)

module.exports = MedicineCartRouter