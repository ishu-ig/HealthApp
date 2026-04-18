const NurseRouter = require("express").Router()

const { nurseUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/NurseController");



NurseRouter.post("", nurseUploader.single("pic"), createRecord);
NurseRouter.get("", getRecord),
NurseRouter.get("/:_id", getSingleRecord),
NurseRouter.put("/:_id", nurseUploader.single("pic"), updaterecord),
NurseRouter.delete("/:_id", deleteRecord)

module.exports = NurseRouter