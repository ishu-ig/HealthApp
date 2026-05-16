const LabtestCategoryRouter = require("express").Router()

const { labtestCategoryUploader } = require("../middleware/fileuploader");

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabtestCategoryController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



LabtestCategoryRouter.post("",verifyAdmin, labtestCategoryUploader.single("pic"), createRecord);
LabtestCategoryRouter.get("", getRecord),
LabtestCategoryRouter.get("/:_id",verifyAdmin, getSingleRecord),
LabtestCategoryRouter.put("/:_id",verifyAdmin, labtestCategoryUploader.single("pic"), updaterecord),
LabtestCategoryRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = LabtestCategoryRouter