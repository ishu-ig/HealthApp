const LabtestRouter = require("express").Router()

const { labtestUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabtestController");



LabtestRouter.post("", labtestUploader.single("pic"), createRecord);
LabtestRouter.get("", getRecord),
LabtestRouter.get("/:_id", getSingleRecord),
LabtestRouter.put("/:_id", labtestUploader.single("pic"), updaterecord),
LabtestRouter.delete("/:_id", deleteRecord)

module.exports = LabtestRouter