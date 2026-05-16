const SpecializationRouter = require("express").Router()

const { specializationUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/SpecializationConlroller");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



SpecializationRouter.post("",verifyAdmin, specializationUploader.single("pic"), createRecord);
SpecializationRouter.get("", getRecord),
SpecializationRouter.get("/:_id",verifyAdmin, getSingleRecord),
SpecializationRouter.put("/:_id",verifyAdmin, specializationUploader.single("pic"), updaterecord),
SpecializationRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = SpecializationRouter