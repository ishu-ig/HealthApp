const MedicineWishlist = require("../models/MedicineWishlist")

async function createRecord(req, res) {
    try {
        let data = new MedicineWishlist(req.body)
        await data.save()

        let finalData = await MedicineWishlist.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name manufacturer finalPrice stockQuantity pic",
                populate: {
                    path: "manufacturer",
                    select: "-_id name"
                }
            })

        res.send({ result: "Done", data: finalData })

    } catch (error) {
        let errorMessage = {}
        if (error.errors?.user)     errorMessage.user     = error.errors.user.message
        if (error.errors?.medicine) errorMessage.medicine = error.errors.medicine.message // ✅ Fix: was "product" — field is "medicine" in schema

        if (Object.keys(errorMessage).length === 0) { // ✅ Fix: was Object.values which always has length
            console.log(error)
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage })
        }
    }
}

async function getRecord(req, res) {
    try {
        // ✅ Fix: filter by logged-in user — only return their wishlist items
        let data = await MedicineWishlist.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name manufacturer finalPrice stockQuantity pic",
                populate: {
                    path: "manufacturer",
                    select: "-_id name"
                }
            })

        res.send({ result: "Done", count: data.length, data: data })

    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await MedicineWishlist.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name manufacturer finalPrice stockQuantity pic",
                populate: {
                    path: "manufacturer",
                    select: "-_id name"
                }
            })

        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await MedicineWishlist.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({ result: "Done", data: data })
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, deleteRecord }