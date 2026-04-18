const LabtestBooking = require("../models/LabtestBooking")
const Razorpay = require("razorpay")
const mailer = require("../mailer/index")
//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                // console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await LabtestBooking.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

async function createRecord(req, res) {
    try {
        let data = new LabtestBooking(req.body);
        await data.save();

        let finalData = await LabtestBooking.findOne({ _id: data._id })
            .populate("user", ["name", "username", "email", "phone", "address", "state", "city", "pin"])
            .populate("resturent", ["name", "finalPrice", "address", "phone"]);

        if (finalData.LabtestBookingStatus) {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: finalData.user.email,
                subject: `LabtestBooking Status Update - Team ${process.env.SITE_NAME}`,
                html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #28a745; text-align: center;">LabtestBooking Confirmation</h2>
                            <p style="color: #555; font-size: 16px; text-align: center;">
                                We are happy to inform you that your LabtestBooking has been <strong>confirmed</strong>! 🎉
                            </p>
                            
                            <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
                                <p style="font-size: 16px; margin: 8px 0;">
                                    <strong>Restaurant:</strong> ${finalData.resturent.name}
                                </p>
                                <p style="font-size: 16px; margin: 8px 0;">
                                    <strong>Seats Reserved:</strong> ${finalData.seats}
                                </p>
                                <p style="font-size: 16px; margin: 8px 0;">
                                    <strong>Date:</strong> ${finalData.date}
                                </p>
                                <p style="font-size: 16px; margin: 8px 0;">
                                    <strong>Time:</strong> ${finalData.time}
                                </p>
                            </div>
                
                            <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
                                If you have any questions, please 
                                <a href="${process.env.SERVER}/contact" style="color: #007bff; text-decoration: none;">contact us</a>.
                            </p>
                
                            <p style="color: #555; font-size: 16px; text-align: center; margin-top: 10px;">
                                Best Regards, <br> <strong>Team ${process.env.SITE_NAME}</strong>
                            </p>
                        </div>
                    `,
            }, (error) => {
                if (error) console.log("Error sending email:", error);
                else console.log("LabtestBooking confirmation email sent successfully.");
            });

        }

        res.send({
            result: "Done",
            data: finalData
        });
    } catch (error) {
        let errorMessage = {};
        if (error.errors?.user) errorMessage.user = error.errors.user.message;
        if (error.errors?.resturent) errorMessage.resturent = error.errors.resturent.message;
        if (error.errors?.seats) errorMessage.seats = error.errors.seats.message;
        if (error.errors?.date) errorMessage.date = error.errors.date.message;
        if (error.errors?.time) errorMessage.time = error.errors.time.message;
        if (error.errors?.finalReservationPrice) errorMessage.finalReservationPrice = error.errors.finalReservationPrice.message;

        if (Object.keys(errorMessage).length > 0) {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            });
        } else {
            console.log(error)
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            });
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await LabtestBooking.find().sort({ _id: -1 })
            .populate("user", ["name", "username", "email", "phone", "address", "state", "city", "pin"])
            .populate("resturent", ["name", "finalPrice", "address", "phone"])
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

async function getUserRecord(req, res) {
    try {
        let data = await LabtestBooking.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate("resturent", ["name", "finalPrice", "address", "phone"])
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
        let data = await LabtestBooking.findOne({ _id: req.params._id })
            .populate("user", ["name", "username", "email", "phone", "address", "state", "city", "pin"])
            .populate("resturent", ["name", "finalPrice", "address", "phone"])
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
        let data = await LabtestBooking.findOne({ _id: req.params._id });
        if (data) {
            data.paymentMode = req.body.paymentMode ?? data.paymentMode;
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus;
            data.LabtestBookingStatus = req.body.LabtestBookingStatus ?? data.LabtestBookingStatus;
            data.rppid = req.body.rppid ?? data.rppid;
            await data.save();

            let finalData = await LabtestBooking.findOne({ _id: data._id })
                .populate("user", ["name", "username", "email", "phone", "address", "state", "city", "pin"])
                .populate("resturent", ["name", "finalPrice", "address", "phone"]);
            if (finalData.LabtestBookingStatus === "false") {
                mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: finalData.user.email,
                    subject: `LabtestBooking Cancellation Notice - Team ${process.env.SITE_NAME}`,
                    html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                                    <h2 style="color: #dc3545; text-align: center;">LabtestBooking Cancellation</h2>
                                    <p style="color: #555; font-size: 16px; text-align: center;">
                                        We regret to inform you that your LabtestBooking has been <strong>cancelled</strong>. 😞
                                    </p>
                                    
                                    <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
                                        <p style="font-size: 16px; margin: 8px 0;">
                                            <strong>Restaurant:</strong> ${finalData.resturent.name}
                                        </p>
                                        <p style="font-size: 16px; margin: 8px 0;">
                                            <strong>Seats Reserved:</strong> ${finalData.seats}
                                        </p>
                                        <p style="font-size: 16px; margin: 8px 0;">
                                            <strong>Date:</strong> ${finalData.date}
                                        </p>
                                        <p style="font-size: 16px; margin: 8px 0;">
                                            <strong>Time:</strong> ${finalData.time}
                                        </p>
                                    </div>
                        
                                    <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
                                        If this was a mistake or you’d like to rebook, please visit 
                                        <a href="${process.env.SERVER}/resturent" style="color: #007bff; text-decoration: none;">your LabtestBookings</a>.
                                    </p>
                        
                                    <p style="color: #555; font-size: 16px; text-align: center; margin-top: 10px;">
                                        We hope to serve you in the future. If you have any concerns, 
                                        <a href="${process.env.SERVER}/contact" style="color: #007bff; text-decoration: none;">contact us</a>.
                                    </p>
                        
                                    <p style="color: #555; font-size: 16px; text-align: center; margin-top: 10px;">
                                        Best Regards, <br> <strong>Team ${process.env.SITE_NAME}</strong>
                                    </p>
                                </div>
                            `,
                }, (error) => {
                    if (error) console.log("Error sending email:", error);
                    else console.log("LabtestBooking cancellation email sent successfully.");
                });
            }


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
        console.error(error);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await LabtestBooking.findOne({ _id: req.params._id })
        if (data) {
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
    getUserRecord: getUserRecord,
    deleteRecord: deleteRecord,
    order: order,
    verifyOrder: verifyOrder
}