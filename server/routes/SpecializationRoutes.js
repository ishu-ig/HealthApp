const SpecializationRouter = require("express").Router()

const { specializationUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/SpecializationConlroller");



SpecializationRouter.post("", specializationUploader.single("pic"), createRecord);
SpecializationRouter.get("", getRecord),
SpecializationRouter.get("/:_id", getSingleRecord),
SpecializationRouter.put("/:_id", specializationUploader.single("pic"), updaterecord),
SpecializationRouter.delete("/:_id", deleteRecord)

module.exports = SpecializationRouter