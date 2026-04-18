const LabtestWishlistRouter = require("express").Router()
const {
    createRecord,
    getRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/MedicineWishlistController")

LabtestWishlistRouter.post("", createRecord)
LabtestWishlistRouter.get("/:userid", getRecord)
LabtestWishlistRouter.get("/single/:_id", getSingleRecord)
LabtestWishlistRouter.delete("/:_id", deleteRecord)


module.exports = LabtestWishlistRouter