const DoctorRouter = require("express").Router()

const { doctorUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/DoctorController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



DoctorRouter.post("", verifyAdmin, doctorUploader.single("pic"), createRecord);
DoctorRouter.get("", getRecord),
DoctorRouter.get("/:_id", getSingleRecord),
DoctorRouter.put("/:_id",verifyAdmin, doctorUploader.single("pic"), updaterecord),
DoctorRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = DoctorRouter