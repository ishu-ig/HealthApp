const LabtestCartRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord } = require("../controllers/LabtestCartController");
const { verifyBoth } = require("../middleware/authorization");



LabtestCartRouter.post("",verifyBoth, createRecord);
LabtestCartRouter.get("/:userid",verifyBoth, getRecord),
LabtestCartRouter.get("/:_id",verifyBoth, getSingleRecord),
LabtestCartRouter.put("/:_id",verifyBoth, updateRecord),
LabtestCartRouter.delete("/:_id",verifyBoth, deleteRecord)

module.exports = LabtestCartRouter