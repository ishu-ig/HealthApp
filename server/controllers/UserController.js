const User = require("../models/User")
const mailer = require("../mailer/index")
const passwordValidator = require("password-validator")
const bcrypt = require("bcrypt")
const fs = require("fs")
// const jwt = require("jsonwebtoken")

const schema = new passwordValidator()

schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase(1) // Must have at least 1 uppercase letter
    .has().lowercase(1) // Must have at least 1 lowercase letter
    .has().digits(1) // Must have at least 1 digit
    .has().symbols(1) // Must have at least 1 special character
    .has().not().spaces() // Should not contain spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist common passwords

async function createRecord(req, res) {
    // Validate password and return failed rules
    const validationErrors = schema.validate(req.body.password, { list: true });

    if (validationErrors.length > 0) {
        // Map validation errors to user-friendly messages
        const errorMessages = validationErrors.map(error => {
            switch (error) {
                case 'min': return "Password must be at least 8 characters long.";
                case 'max': return "Password must not exceed 100 characters.";
                case 'uppercase': return "Password must contain at least one uppercase letter.";
                case 'lowercase': return "Password must contain at least one lowercase letter.";
                case 'digits': return "Password must contain at least one digit.";
                case 'symbols': return "Password must contain at least one special character.";
                case 'spaces': return "Password should not contain spaces.";
                case 'oneOf': return "This password is too common. Please choose another one.";
                default: return "Invalid password.";
            }
        });

        return res.status(400).send({
            result: "Fail",
            reason: errorMessages
        });
    }

    // Proceed with password hashing and user creation
    bcrypt.hash(req.body.password, 12, async (error, hash) => {
        if (error) {
            return res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            });
        }
        try {
            let data = new User(req.body)
            if (req.headers.authorization) {
                data.role = req.body.role
                data.active = req.body.active
            }
            else
                data.role = "Buyer";
            data.password = hash;
            await data.save();
            res.send({
                result: "Done",
                data: data
            });
        } catch (error) {

            try {
                fs.unlinkSync(req.file.path)
            } catch (error) { }

            let errorMessage = {};

            if (error.keyValue?.username) errorMessage.username = "User with this Username Already Exists.";
            if (error.keyValue?.email) errorMessage.email = "User with this Email Address Already Exists.";
            if (error.errors?.name) errorMessage.name = error.errors.name.message;
            if (error.errors?.username) errorMessage.username = error.errors.username.message;
            if (error.errors?.email) errorMessage.email = error.errors.email.message;
            if (error.errors?.phone) errorMessage.phone = error.errors.phone.message;
            if (error.errors?.password) errorMessage.password = error.errors.password.message;

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
    });
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
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

async function updateRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.state = req.body.state ?? data.state
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.active = req.body.active ?? data.active
            if (req.headers.authorization)
                data.role = req.body.role
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
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.keyValue ? errorMessage.username = "User with this Username Already Exist" : null
        error.keyValue ? errorMessage.username = "User with this Email Address Already Exist" : null
        // console.log(error)
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

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
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



async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username.trim() },
                { email: req.body.username.trim() }
            ]
        });

        if (!data) {
            return res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, data.password);

        if (!isMatch) {
            return res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            });
        }

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}
async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8).toString().padEnd(6, 1)))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Your OTP for Password Reset – Team ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                        <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
                        <p>Hello <strong>${data.name}</strong>,</p>
                        <p>You have requested a password reset.</p>
                        <div style="text-align: center; font-size: 18px; font-weight: bold; padding: 10px; background-color: #f3f3f3; border-radius: 5px;">
                            Your OTP: <span style="color: #d32f2f; font-size: 22px;">${data.otp}</span>
                        </div>
                        <p style="color: #d32f2f; text-align: center; font-size: 14px;">Please do not share this OTP with anyone.</p>
                        <p>This OTP is valid for a limited time.</p>
                        <p>Regards,</p>
                        <p><strong>Team ${process.env.SITE_NAME}</strong></p>
                    </div>
                `
            }, (error) => {
                if (error) {
                    console.log(error);
                }
            });

            res.send({
                result: "Done",
                message: "OTP Has Been Send On Your Registered Email Address"
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "User Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (data.otp === req.body.otp) {
                res.send({
                    result: "Done"
                })
            }
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        });

        if (!data) {
            return res.status(401).send({
                result: "Fail",
                reason: "Unauthorized Activity"
            });
        }

        // Validate password and return failed rules
        const validationErrors = schema.validate(req.body.password, { list: true });

        if (validationErrors.length > 0) {
            // Map validation errors to user-friendly messages
            const errorMessages = validationErrors.map(error => {
                switch (error) {
                    case 'min': return "Password must be at least 8 characters long.";
                    case 'max': return "Password must not exceed 100 characters.";
                    case 'uppercase': return "Password must contain at least one uppercase letter.";
                    case 'lowercase': return "Password must contain at least one lowercase letter.";
                    case 'digits': return "Password must contain at least one digit.";
                    case 'symbols': return "Password must contain at least one special character.";
                    case 'spaces': return "Password should not contain spaces.";
                    case 'oneOf': return "This password is too common. Please choose another one.";
                    default: return "Invalid password.";
                }
            });

            return res.status(400).send({
                result: "Fail",
                reason: errorMessages
            });
        }

        // Hash the password and update it
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                return res.status(500).send({
                    result: "Fail",
                    reason: "Internal Server Error"
                });
            }

            data.password = hash;
            await data.save();
            res.send({
                result: "Done",
                reason: "Password has been successfully reset"
            });
        });

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}