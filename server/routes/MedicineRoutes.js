const MedicineRouter = require("express").Router()

const { medicineUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/MedicineController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



MedicineRouter.post("",verifyAdmin, medicineUploader.array("pic"), createRecord);
MedicineRouter.get("", getRecord),
MedicineRouter.get("/:_id", getSingleRecord),
MedicineRouter.put("/:_id",verifyAdmin, medicineUploader.array("pic"), updateRecord),
MedicineRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = MedicineRouter