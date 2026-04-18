const DoctorRouter = require("express").Router()

const { doctorUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/DoctorController");



DoctorRouter.post("", doctorUploader.single("pic"), createRecord);
DoctorRouter.get("", getRecord),
DoctorRouter.get("/:_id", getSingleRecord),
DoctorRouter.put("/:_id", doctorUploader.single("pic"), updaterecord),
DoctorRouter.delete("/:_id", deleteRecord)

module.exports = DoctorRouter