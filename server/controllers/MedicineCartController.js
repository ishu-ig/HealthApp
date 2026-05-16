const MedicineCart = require("../models/MedicineCart");

async function createRecord(req, res) {
    try {
        let data = new MedicineCart(req.body);
        await data.save();

        let finalData = await MedicineCart.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer finalPrice pic stock stockQuantity expireDate",
                populate: [
                    {
                        path: "medicineCategory",
                        select: "-_id name"
                    },
                    {
                        path: "manufacturer",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            });

        res.send({
            result: "Done",
            data: finalData
        });

    } catch (error) {
        let errorMessage = {};

        if (error.errors?.user)
            errorMessage.user = error.errors.user.message;

        if (error.errors?.medicine)
            errorMessage.medicine = error.errors.medicine.message;

        if (error.errors?.qty)
            errorMessage.qty = error.errors.qty.message;

        if (error.errors?.total)
            errorMessage.total = error.errors.total.message;

        if (Object.keys(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            });
        } else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            });
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await MedicineCart.find({ user: req.params.userid })
            .sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer finalPrice pic stock stockQuantity expireDate",
                populate: [
                    {
                        path: "medicineCategory",
                        select: "-_id name"
                    },
                    {
                        path: "manufacturer",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            });

        res.send({
            result: "Done",
            count: data.length,
            data: data || []
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "medicine",
                select: "name medicineCategory manufacturer finalPrice pic stock stockQuantity expireDate",
                populate: [
                    {
                        path: "medicineCategory",
                        select: "-_id name"
                    },
                    {
                        path: "manufacturer",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            });

        if (data) {
            res.send({
                result: "Done",
                data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

async function updateRecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id });

        if (data) {
            data.qty = req.body.qty ?? data.qty;
            data.total = req.body.total ?? data.total;

            await data.save();

            let finalData = await MedicineCart.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "medicine",
                    select: "name medicineCategory manufacturer finalPrice pic stock stockQuantity expireDate",
                    populate: [
                        {
                            path: "medicineCategory",
                            select: "-_id name"
                        },
                        {
                            path: "manufacturer",
                            select: "-_id name"
                        }
                    ],
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                });

            res.send({
                result: "Done",
                data: finalData
            });

        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await MedicineCart.findOne({ _id: req.params._id });

        if (data) {
            await data.deleteOne();

            res.send({
                result: "Done",
                data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
};