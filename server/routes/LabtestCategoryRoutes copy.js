const LabtestCategoryRouter = require("express").Router()

const { labtestCategoryUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabtestCategoryController");



LabtestCategoryRouter.post("", labtestCategoryUploader.single("pic"), createRecord);
LabtestCategoryRouter.get("", getRecord),
LabtestCategoryRouter.get("/:_id", getSingleRecord),
LabtestCategoryRouter.put("/:_id", labtestCategoryUploader.single("pic"), updaterecord),
LabtestCategoryRouter.delete("/:_id", deleteRecord)

module.exports = LabtestCategoryRouter