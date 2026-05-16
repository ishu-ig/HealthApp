const TestimonialRouter = require("express").Router()
const { testimonialUploader } = require("../middleware/fileuploader")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/TestimonialController")
const { verifyBoth, verifyAdmin } = require("../middleware/authorization")

TestimonialRouter.post("",verifyAdmin, testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("", getRecord)
TestimonialRouter.get("/:_id",verifyBoth, getSingleRecord)
TestimonialRouter.put("/:_id",verifyBoth, testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id",verifyBoth, deleteRecord)


module.exports = TestimonialRouter