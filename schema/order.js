const mongoose = require("mongoose")

const Order = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    book:{
        type:mongoose.Types.ObjectId,
        ref:"books"
    },
    status:{
        type:String,
        default:"Order Placed",
        enum:["Order Placed","Out for Delivery","Delivered","Cancelled"]
    }
},{
    timestamps:true
})

module.exports = mongoose.model("orders",Order)