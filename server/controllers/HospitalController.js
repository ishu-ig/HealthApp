const Hospital = require("../models/Hospital")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Hospital(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Hospital With this name Already Exist" : null,
            error.keyValue ? errorMessage.email = "Email Already Exist" : null,
            error.errors?.name ? errorMessage.name = error.errors.name.message : null,
            error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null;
        error.errors?.email ? errorMessage.email = error.errors.email.message : null;
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null;
        error.errors?.address ? errorMessage.address = error.errors.address.message : null;
        error.errors?.state ? errorMessage.state = error.errors.state.message : null;
        error.errors?.city ? errorMessage.city = error.errors.city.message : null;
        error.errors?.pincode ? errorMessage.pincode = error.errors.pincode.message : null;
        error.errors?.establishYear ? errorMessage.establishYear = error.errors.establishYear.message : null;
        error.errors?.accreditation ? errorMessage.accreditation = error.errors.accreditation.message : null;
        error.errors?.emergencyContact ? errorMessage.emergencyContact = error.errors.emergencyContact.message : null;

        console.log(error)

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
        let data = await Hospital.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Hospital.findOne({ _id: req.params._id })
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
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}
async function updaterecord(req, res) {
    try {
        let data = await Hospital.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name,
                data.email = req.body.email ?? data.email,
                data.phone = req.body.phone ?? data.phone,
                data.city = req.body.city ?? data.city,
                data.state = req.body.state ?? data.state,
                data.pincode = req.body.pincode ?? data.pincode,
                data.address = req.body.address ?? data.address,
                data.accreditation = req.body.accreditation ?? data.accreditation,
                data.emergencyContact = req.body.emergencyContact ?? data.emergencyContact,
                data.establishYear = req.body.establishYear ?? data.establishYear,
                data.departments = req.body.departments ?? data.departments,
                data.active = req.body.active ?? data.active
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Done",
                reason: "Record Not Found"
            })
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Hospital.findOne({ _id: req.params._id })
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
    updaterecord: updaterecord,
    deleteRecord: deleteRecord
}