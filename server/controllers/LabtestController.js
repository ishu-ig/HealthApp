const Labtest = require("../models/Labtest")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Labtest(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        // ✅ Populate both labtestCategory and lab
        let finalData = await Labtest.findOne({ _id: data._id })
            .populate("labtestCategory", ["name"])
            .populate("lab", ["name"])
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        try { fs.unlinkSync(req.file.path) } catch (e) {}
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Labtest Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error.errors?.labtestCategory ? errorMessage.labtestCategory = error.errors.labtestCategory.message : null
        error.errors?.lab ? errorMessage.lab = error.errors.lab.message : null
        error.errors?.description ? errorMessage.description = error.errors.description.message : null
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : null
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null
        error.errors?.finalPrice ? errorMessage.finalPrice = error.errors.finalPrice.message : null
        error.errors?.sampleRequired ? errorMessage.sampleRequired = error.errors.sampleRequired.message : null
        error.errors?.reportTime ? errorMessage.reportTime = error.errors.reportTime.message : null

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage })
        }
    }
}

async function getRecord(req, res) {
    try {
        // ✅ Populate both
        let data = await Labtest.find().sort({ _id: -1 })
            .populate("labtestCategory", ["name"])
            .populate("lab", ["name"])
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Labtest.findOne({ _id: req.params._id })
            .populate("labtestCategory", ["name"])
            .populate("lab", ["name"])
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updaterecord(req, res) {
    try {
        let data = await Labtest.findOne({ _id: req.params._id })
        if (data) {
            // ✅ Fixed field names to match schema
            data.name = req.body.name ?? data.name
            data.labtestCategory = req.body.labtestCategory ?? data.labtestCategory
            data.lab = req.body.lab ?? data.lab
            data.description = req.body.description ?? data.description
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.sampleRequired = req.body.sampleRequired ?? data.sampleRequired
            data.reportTime = req.body.reportTime ?? data.reportTime
            data.preperation = req.body.preperation ?? data.preperation
            data.active = req.body.active ?? data.active

            await data.save()

            if (req.file) {
                try { fs.unlinkSync(data.pic) } catch (e) {}
                data.pic = req.file.path
                await data.save()
            }

            let finaldata = await Labtest.findOne({ _id: data._id })
                .populate("labtestCategory", ["name"])
                .populate("lab", ["name"])
            res.send({ result: "Done", data: finaldata })
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }
    } catch (error) {
        console.log(error)
        try { fs.unlinkSync(req.file?.path) } catch (e) {}
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Labtest.findOne({ _id: req.params._id })
        if (data) {
            try { fs.unlinkSync(data.pic) } catch (e) {}
            await data.deleteOne()
            res.send({ result: "Done", data: data })
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updaterecord, deleteRecord }