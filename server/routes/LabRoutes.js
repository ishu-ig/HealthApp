const LabRouter = require("express").Router()

const { labUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



LabRouter.post("",verifyAdmin, labUploader.single("pic"), createRecord);
LabRouter.get("",getRecord),
LabRouter.get("/:_id",verifyAdmin, getSingleRecord),
LabRouter.put("/:_id",verifyAdmin, labUploader.single("pic"), updaterecord),
LabRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = LabRouter