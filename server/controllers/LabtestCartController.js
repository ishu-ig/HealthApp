const LabtestCart = require("../models/LabtestCart"); // ✅ Fix: was requiring wrong model ("../models/Labtest")
const fs = require("fs");

async function createRecord(req, res) {
    try {
        let data = new LabtestCart(req.body);
        await data.save();

        let finaldata = await LabtestCart.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",             // ✅ Fix: was "Labtest" (wrong case, must match schema field name)
                select: "name labtestCategory lab basePrice finalPrice reservationDate pic",
                populate: [
                    { path: "labtestCategory", select: "-_id name" }, // ✅ Fix: was "LabtestCategory"
                    { path: "lab", select: "-_id name" }              // ✅ Fix: duplicate populate removed, now array
                ]
            });

        res.send({ result: "Done", data: finaldata });

    } catch (error) {
        let errorMessage = {};
        if (error.errors?.user)    errorMessage.user    = error.errors.user.message;
        if (error.errors?.labtest) errorMessage.labtest = error.errors.labtest.message; // ✅ Fix: was "Labtest"
        if (error.errors?.total)   errorMessage.total   = error.errors.total.message;
        if (error.errors?.reservationDate) errorMessage.reservationDate = error.errors.reservationDate.message; // ✅ Added missing field

        if (Object.keys(errorMessage).length === 0) {
            console.log(error);
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage });
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await LabtestCart.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",             // ✅ Fix: was "Labtest"
                select: "name labtestCategory lab basePrice finalPrice pic",
                populate: [
                    { path: "labtestCategory", select: "-_id name" }, // ✅ Fix: was "LabtestCategory"
                    { path: "lab", select: "-_id name" }
                ]
            });

        res.send({ result: "Done", count: data.length, data: data });

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await LabtestCart.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",             // ✅ Fix: was "Labtest"
                select: "name labtestCategory lab basePrice finalPrice pic",
                populate: [
                    { path: "labtestCategory", select: "-_id name" },
                    { path: "lab", select: "-_id name" }
                ]
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
        let data = await LabtestCart.findOne({ _id: req.params._id });

        if (data) {
            data.total           = req.body.total           ?? data.total;
            data.reservationDate = req.body.reservationDate ?? data.reservationDate; // ✅ Added missing update field
            await data.save();

            let finaldata = await LabtestCart.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "labtest",         // ✅ Fix: was "Labtest"
                    select: "name labtestCategory lab basePrice finalPrice pic",
                    populate: [
                        { path: "labtestCategory", select: "-_id name" },
                        { path: "lab", select: "-_id name" }
                    ]
                });

            res.send({ result: "Done", data: finaldata });

        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

    } catch (error) {
        try {
            if (req.file?.path) fs.unlinkSync(req.file.path);
        } catch (err) {}

        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await LabtestCart.findOne({ _id: req.params._id });
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

module.exports = { createRecord, getRecord, getSingleRecord, updaterecord, deleteRecord };