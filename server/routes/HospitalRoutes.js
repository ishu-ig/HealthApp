const HospitalRouter = require("express").Router()

const { hospitalUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/HospitalController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



HospitalRouter.post("",verifyAdmin, hospitalUploader.single("pic"), createRecord);
HospitalRouter.get("", getRecord),
HospitalRouter.get("/:_id",verifyAdmin, getSingleRecord),
HospitalRouter.put("/:_id", verifyAdmin,hospitalUploader.single("pic"), updaterecord),
HospitalRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = HospitalRouter