const multer = require("multer")

function createUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/${folder}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })

    return multer({ storage: storage })
}

module.exports = {
    specializationUploader: createUploader("specialization"),
    medicineCategoryUploader: createUploader("medicineCategory"),
    hospitalUploader: createUploader("hospital"),
    labtestCategoryUploader: createUploader("labtestCategory"),
    labtestUploader: createUploader("labtest"),
    medicineUploader: createUploader("medicine"),
    labUploader: createUploader("lab"),
    medicineUploader: createUploader("medicine"),
    doctorUploader: createUploader("doctor"),
    nurseUploader: createUploader("nurse"),
    testimonialUploader: createUploader("testimonial"),
    userUploader: createUploader("user")
}