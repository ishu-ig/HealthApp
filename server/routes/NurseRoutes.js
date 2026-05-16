const NurseRouter = require("express").Router()

const { nurseUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/NurseController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



NurseRouter.post("",verifyAdmin, nurseUploader.single("pic"), createRecord);
NurseRouter.get("", getRecord),
NurseRouter.get("/:_id", getSingleRecord),
NurseRouter.put("/:_id",verifyAdmin, nurseUploader.single("pic"), updaterecord),
NurseRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = NurseRouter