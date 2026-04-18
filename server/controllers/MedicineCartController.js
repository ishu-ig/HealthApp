const MedicineCart = require("../models/MedicineCart");
const fs = require("fs");

async function createRecord(req, res) {
    try {
        let data = new MedicineCart(req.body);
        await data.save();

        let finaldata = await MedicineCart.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer basePrice finalPrice discount stockQuantity pic", // ✅ Fixed comma issue
                populate: {
                    path: "medicineCategory",
                    select: "-_id name"
                }
            });

        res.send({ result: "Done", data: finaldata });

    } catch (error) {
        
        let errorMessage = {};
        error.errors?.user ? errorMessage.user = error.errors.user.message : null
        error.errors?.medicine ? errorMessage.medicine = error.errors.medicine.message : null
        error.errors?.qty ? errorMessage.qty = error.errors.qty.message : null
        error.errors?.total ? errorMessage.total = error.errors.total.message : null

        if (Object.keys(errorMessage).length === 0) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
            console.log(error)
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage });
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await MedicineCart.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer basePrice finalPrice discount stockQuantity pic",
                populate: {
                    path: "medicineCategory",
                    select: "-_id name"
                }
            });

        res.send({ result: "Done", count: data.length, data: data });

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer basePrice finalPrice discount stockQuantity pic",
                populate: {
                    path: "medicineCategory",
                    select: "-_id name"
                }
            });

        if (data) {
            res.send({ result: "Done", data: data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function updaterecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id });

        if (data) {
            data.qty = req.body.qty ?? data.qty;
            data.total = req.body.total ?? data.total;
            await data.save();

            let finaldata = await MedicineCart.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "medicine",
                    select: "name medicineCategory manufacturer basePrice finalPrice discount stockQuantity pic",
                    populate: {
                        path: "medicineCategory",
                        select: "-_id name"
                    }
                });

            res.send({ result: "Done", data: finaldata });

        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

    } catch (error) {
        try {
            if (req.file?.path) fs.unlinkSync(req.file.path);
        } catch (err) { }

        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });

    }
}

async function deleteRecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne();
            res.send({ result: "Done", data: data });

        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updaterecord,
    deleteRecord
};
