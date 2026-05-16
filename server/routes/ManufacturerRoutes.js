const ManufacturerRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/ManufacturerController");
const { verifyAdmin, verifyBoth } = require("../middleware/authorization");



ManufacturerRouter.post("",verifyAdmin,  createRecord);
ManufacturerRouter.get("", getRecord),
ManufacturerRouter.get("/:_id",verifyAdmin, getSingleRecord),
ManufacturerRouter.put("/:_id",verifyAdmin, updateRecord),
ManufacturerRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = ManufacturerRouter