const LabtestRouter = require("express").Router()

const { labtestUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabtestController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



LabtestRouter.post("",verifyAdmin, labtestUploader.single("pic"), createRecord);
LabtestRouter.get("", getRecord),
LabtestRouter.get("/:_id", getSingleRecord),
LabtestRouter.put("/:_id",verifyAdmin, labtestUploader.single("pic"), updaterecord),
LabtestRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = LabtestRouter