const HospitalRouter = require("express").Router()

const { hospitalUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/HospitalController");



HospitalRouter.post("", hospitalUploader.single("pic"), createRecord);
HospitalRouter.get("", getRecord),
HospitalRouter.get("/:_id", getSingleRecord),
HospitalRouter.put("/:_id", hospitalUploader.single("pic"), updaterecord),
HospitalRouter.delete("/:_id", deleteRecord)

module.exports = HospitalRouter