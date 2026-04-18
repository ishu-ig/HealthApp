const ManufacturerRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/ManufacturerController");



ManufacturerRouter.post("",  createRecord);
ManufacturerRouter.get("", getRecord),
ManufacturerRouter.get("/:_id", getSingleRecord),
ManufacturerRouter.put("/:_id", updateRecord),
ManufacturerRouter.delete("/:_id", deleteRecord)

module.exports = ManufacturerRouter