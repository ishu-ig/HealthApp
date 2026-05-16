const MedicineCategoryRouter = require("express").Router()

const { medicineCategoryUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/MedicineCategoryController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



MedicineCategoryRouter.post("",verifyAdmin, medicineCategoryUploader.single("pic"), createRecord);
MedicineCategoryRouter.get("", getRecord),
MedicineCategoryRouter.get("/:_id",verifyAdmin, getSingleRecord),
MedicineCategoryRouter.put("/:_id",verifyAdmin, medicineCategoryUploader.single("pic"), updaterecord),
MedicineCategoryRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = MedicineCategoryRouter