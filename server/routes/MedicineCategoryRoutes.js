const MedicineCategoryRouter = require("express").Router()

const { medicineCategoryUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/MedicineCategoryController");



MedicineCategoryRouter.post("", medicineCategoryUploader.single("pic"), createRecord);
MedicineCategoryRouter.get("", getRecord),
MedicineCategoryRouter.get("/:_id", getSingleRecord),
MedicineCategoryRouter.put("/:_id", medicineCategoryUploader.single("pic"), updaterecord),
MedicineCategoryRouter.delete("/:_id", deleteRecord)

module.exports = MedicineCategoryRouter