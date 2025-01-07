const mongoose = require("mongoose")

const contact = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:true

    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("contact",contact)