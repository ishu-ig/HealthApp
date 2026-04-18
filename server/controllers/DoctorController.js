const Doctor = require("../models/Doctor")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Doctor(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        let finalData = await Doctor.findOne({ _id: data._id })
            .populate("specialization", ["name"])
            .populate("hospital",["name"])
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null,
            error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null;
        error.errors?.specialization ? errorMessage.specialization = error.errors.specialization.message : null;
        error.errors?.hospital ? errorMessage.hospital = error.errors.hospital.message : null;
        error.errors?.email ? errorMessage.email = error.errors.email.message : null;
        error.errors?.bio ? errorMessage.bio = error.errors.bio.message : null;
        error.errors?.gender ? errorMessage.gender = error.errors.gender.message : null;
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null;
        error.errors?.dob ? errorMessage.dob = error.errors.dob.message : null;
        error.errors?.fees ? errorMessage.fees = error.errors.fees.message : null;
        error.errors?.availableDays ? errorMessage.availableDays = error.errors.availableDays.message : null;
        error.errors?.availableTime ? errorMessage.availableTime = error.errors.availableTime.message : null;
        error.errors?.qualification ? errorMessage.qualification = error.errors.qualification.message : null;
        error.errors?.address ? errorMessage.address = error.errors.address.message : null;
        error.errors?.state ? errorMessage.state = error.errors.state.message : null;
        error.errors?.city ? errorMessage.city = error.errors.city.message : null;
        error.errors?.pincode ? errorMessage.pincode = error.errors.pincode.message : null;
        
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
        let data = await Doctor.find().sort({ _id: -1 })
            .populate("specialization", ["name"])
            .populate("hospital",["name"])
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
        let data = await Doctor.findOne({ _id: req.params._id })
            .populate("specialization", ["name"])
            .populate("hospital",["name"])
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
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}
async function updaterecord(req, res) {
    try {
         let data = await Doctor.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name,
                data.specialization = req.body.specialization ?? data.specialization,
                data.email = req.body.email ?? data.email,
                data.phone = req.body.phone ?? data.phone,
                data.gender = req.body.gender ?? data.gender,
                data.dob = req.body.dob ?? data.dob,
                data.experience = req.body.experience ?? data.experience,
                data.qualification = req.body.qualification ?? data.qualification,
                data.bio = req.body.bio ?? data.bio,
                data.fees = req.body.fees ?? datafees,
                data.availableDays = req.body.availableDays ?? data.availableDays,
                data.availableTime = req.body.availableTime ?? data.availableTime,
                data.active = req.body.active ?? data.active
                data.address = req.body.address ?? data.address
                data.city = req.body.city ?? data.city
                data.state = req.body.state ?? data.state
                data.pincode = req.body.pincode ?? data.pincode
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
            let finaldata = await Doctor.findOne({ _id: data._id })
                .populate("specialization", ["name"])
                .populate("hospital",["name"])
            res.send({
                result: "Done",
                data: finaldata
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
        let data = await Doctor.findOne({ _id: req.params._id })
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