const NewsletterRouter = require("express").Router()

const { createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord } = require("../controllers/NewsletterController");



NewsletterRouter.post("", createRecord);
NewsletterRouter.get("", getRecord),
NewsletterRouter.get("/:_id", getSingleRecord),
NewsletterRouter.put("/:_id", updaterecord),
NewsletterRouter.delete("/:_id", deleteRecord)

module.exports = NewsletterRouter