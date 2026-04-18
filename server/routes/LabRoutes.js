const LabRouter = require("express").Router()

const { labUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabController");



LabRouter.post("", labUploader.single("pic"), createRecord);
LabRouter.get("", getRecord),
LabRouter.get("/:_id", getSingleRecord),
LabRouter.put("/:_id", labUploader.single("pic"), updaterecord),
LabRouter.delete("/:_id", deleteRecord)

module.exports = LabRouter