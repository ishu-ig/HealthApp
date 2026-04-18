const MedicineWishlistRouter = require("express").Router()
const {
    createRecord,
    getRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/MedicineWishlistController")

MedicineWishlistRouter.post("", createRecord)
MedicineWishlistRouter.get("/:userid", getRecord)
MedicineWishlistRouter.get("/single/:_id", getSingleRecord)
MedicineWishlistRouter.delete("/:_id", deleteRecord)


module.exports = MedicineWishlistRouter