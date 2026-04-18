const mongoose = require("mongoose")

const LabtestCartSchema = new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"User Id Is Mendatory"]
   },
   labtest:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Labtest",
    required:[true,"Labtest Id Is Mendatory"]
   },
   reservationDate:{
      type:Date,
      required:[true,"Reservation date Is Mendatory"]
   },
   total:{
    type:Number,
    required:[true,"Total Is Mendatory"]
   }
})

const LabtestCart = new mongoose.model("LabtestCart", LabtestCartSchema)
module.exports = LabtestCart