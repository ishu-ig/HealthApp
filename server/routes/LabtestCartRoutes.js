const LabtestCartRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/LabtestCartController");



LabtestCartRouter.post("", createRecord);
LabtestCartRouter.get("", getRecord),
LabtestCartRouter.get("/:_id", getSingleRecord),
LabtestCartRouter.put("/:_id", updaterecord),
LabtestCartRouter.delete("/:_id", deleteRecord)

module.exports = LabtestCartRouter