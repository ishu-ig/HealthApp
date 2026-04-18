const Manufacturer = require("../models/Manufacturer")

async function createRecord(req, res) {
    try {
        let data = new Manufacturer(req.body)
        await data.save()

        res.send({
            result: "Done",
            data: data,
            message:"Thanks to Subscribe Our Manufacturer Service"
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null;
        error.errors?.email ? errorMessage.email = error.errors.email.message : null;
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null;
        error.errors?.companyName ? errorMessage.companyName = error.errors.companyName.message : null;
        error.errors?.licenseNumber ? errorMessage.licenseNumber = error.errors.licenseNumber.message : null;
        error.errors?.gstNumber ? errorMessage.gstNumber = error.errors.gstNumber.message : null;
        error.errors?.address ? errorMessage.address = error.errors.address.message : null;
        error.errors?.city ? errorMessage.city = error.errors.city.message : null;
        error.errors?.state ? errorMessage.state = error.errors.state.message : null;
        error.errors?.pincode ? errorMessage.pincode = error.errors.pincode.message : null;
        error.errors?.country ? errorMessage.country = error.errors.country.message : null;
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
        let data = await Manufacturer.find().sort({ _id: -1 })
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
        let data = await Manufacturer.findOne({ _id: req.params._id })
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
        let data = await Manufacturer.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name;
            data.email = req.body.email ?? data.email;
            data.phone = req.body.phone ?? data.phone;
            data.companyName = req.body.companyName ?? data.companyName;
            data.licenseNumber = req.body.licenseNumber ?? data.licenseNumber;
            data.gstNumber = req.body.gstNumber ?? data.gstNumber;
            data.establishedYear = req.body.establishedYear ?? data.establishedYear;
            data.website = req.body.website ?? data.website;
            data.certifications = req.body.certifications ?? data.certifications;
            data.active = req.body.active ?? data.active;
            data.address = req.body.address ?? data.address;
            data.city = req.body.city ?? data.city;
            data.state = req.body.state ?? data.state;
            data.pincode = req.body.pincode ?? data.pincode;
            data.country = req.body.country ?? data.country;
            await data.save()

            res.send({
                result: "Done",
                data: data
            })
        }
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

async function deleteRecord(req, res) {
    try {
        let data = await Manufacturer.findOne({ _id: req.params._id })
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