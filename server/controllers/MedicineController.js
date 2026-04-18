const Medicine = require("../models/Medicine")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Medicine(req.body)
        if (req.files) {
            data.pic = Array.from(req.files).map((x) => x.path)
        }
        await data.save()
        let finalData = await Medicine.findOne({ _id: data._id })
            .populate("medicineCategory", ["name"])
            .populate("manufacturer", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {

        try {
            Array.from(req.files).forEach(x => fs.unlinkSync(x.path))
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null;
        error.errors?.medicineCategory ? errorMessage.medicineCategory = error.errors.medicineCategory.message : null;
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null;
        error.errors?.description ? errorMessage.description = error.errors.description.message : null;
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : null;
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null;
        error.errors?.finalPrice ? errorMessage.finalPrice = error.errors.finalPrice.message : null;
        error.errors?.stockQuantity ? errorMessage.stockQuantity = error.errors.stockQuantity.message : null;
        error.errors?.expireDate ? errorMessage.expireDate = error.errors.expireDate.message : null;
        error.errors?.manufacturer ? errorMessage.manufacturer = error.errors.manufacturer.message : null;

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await Medicine.find().sort({ _id: -1 })
            .populate("medicineCategory", ["name"])
            .populate("manufacturer", ["name"])
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function getSingleRecord(req, res) {
    try {
        let data = await Medicine.findOne({ _id: req.params._id })
            .populate("medicineCategory", ["name"])
            .populate("manufacturer", ["name"])
            .populate("brand", ["name"])
        if (data)
            res.send({
                result: "Done",
                data: data
            })
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Medicine.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name;
            data.medicineCategory = req.body.medicineCategory ?? data.medicineCategory;
            data.description = req.body.description ?? data.description;
            data.basePrice = req.body.basePrice ?? data.basePrice;
            data.discount = req.body.discount ?? data.discount;
            data.finalPrice = req.body.finalPrice ?? data.finalPrice;
            data.stock = req.body.stock ?? data.stock;
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
            data.expireDate = req.body.expireDate ?? data.expireDate;
            data.manufacturer = req.body.manufacturer ?? data.manufacturer;
            data.active = req.body.active ?? data.active;
            data.pic.forEach((x, index) => {
                if (!req.body.oldPics.includes(x)) {
                    try {
                        fs.unlink(x, error => {
                            error ? console.log(error) : data.pic.splice(index, 1)
                        })
                    } catch (error) {
                        console.log("error", error)
                    }
                }
            })
            if (req.files) {
                data.pic = req.body.oldPics ? (req.body.oldPics?.split(",").filter(x => x !== "").concat(Array.from(req.files).map(x => x.path))) : Array.from(req.files)
                await data.save()
            }
            let finalData = await Medicine.findOne({ _id: data._id })
                .populate("medicineCategory", ["name"])
                .populate("manufacturer", ["name"])

            res.send({
                result: "Done",
                data: finalData
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        console.log(error)
        try {
            Array.from(req.files).forEach(x => fs.unlinkSync(x.path))
        } catch (error) { }


        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Medicine.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}