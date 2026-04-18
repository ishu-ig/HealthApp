const MedicineRouter = require("express").Router()

const { medicineUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/MedicineController");



MedicineRouter.post("", medicineUploader.array("pic"), createRecord);
MedicineRouter.get("", getRecord),
MedicineRouter.get("/:_id", getSingleRecord),
MedicineRouter.put("/:_id", medicineUploader.array("pic"), updateRecord),
MedicineRouter.delete("/:_id", deleteRecord)

module.exports = MedicineRouter