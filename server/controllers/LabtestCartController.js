const LabtestCart = require("../models/LabtestCart");

async function createRecord(req, res) {
    try {
        let data = new LabtestCart(req.body);
        await data.save();

        let finalData = await LabtestCart.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",
                select: "name labtestCategory lab finalPrice pic",
                populate: [
                    {
                        path: "labtestCategory",
                        select: "-_id name"
                    },
                    {
                        path: "lab",
                        select: "-_id name"
                    }
                ]
            });

        res.send({
            result: "Done",
            data: finalData
        });

    } catch (error) {
        let errorMessage = {};

        if (error.errors?.user)
            errorMessage.user = error.errors.user.message;

        if (error.errors?.labtest)
            errorMessage.labtest = error.errors.labtest.message;

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
        let data = await LabtestCart.find({ user: req.params.userid })
            .sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",
                select: "name labtestCategory lab finalPrice pic",
                populate: [
                    {
                        path: "labtestCategory",
                        select: "-_id name"
                    },
                    {
                        path: "lab",
                        select: "-_id name"
                    }
                ]
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
        let data = await LabtestCart.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "labtest",
                select: "name labtestCategory lab finalPrice pic",
                populate: [
                    {
                        path: "labtestCategory",
                        select: "-_id name"
                    },
                    {
                        path: "lab",
                        select: "-_id name"
                    }
                ]
            });

        if (data) {
            res.send({
                result: "Done",
                data: data
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
        let data = await LabtestCart.findOne({ _id: req.params._id });

        if (data) {
            data.total = req.body.total ?? data.total;

            await data.save();

            let finalData = await LabtestCart.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "labtest",
                    select: "name labtestCategory lab finalPrice pic",
                    populate: [
                        {
                            path: "labtestCategory",
                            select: "-_id name"
                        },
                        {
                            path: "lab",
                            select: "-_id name"
                        }
                    ]
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
        let data = await LabtestCart.findOne({ _id: req.params._id });

        if (data) {
            await data.deleteOne();

            res.send({
                result: "Done",
                data: data
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