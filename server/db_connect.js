const mongoose = require("mongoose")

mongoose.connect(process.env.DB_KEY)
.then(() => {
    console.log("Database connected")
})
.catch((err) => {
    console.error("DB Error:", err)
})