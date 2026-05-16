const NewsletterRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/NewsletterController");
const { verifyBoth, verifyAdmin } = require("../middleware/authorization");



NewsletterRouter.post("",verifyBoth, createRecord);
NewsletterRouter.get("",verifyAdmin, getRecord),
NewsletterRouter.get("/:_id",verifyAdmin, getSingleRecord),
NewsletterRouter.put("/:_id",verifyAdmin, updaterecord),
NewsletterRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = NewsletterRouter