const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2023/06/23/11/23/ai-generated-8083323_1280.jpg"
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    favorites:[
        {type:mongoose.Types.ObjectId,
            ref:"books"}
    
    ],
    cart:[
        {type:mongoose.Types.ObjectId,
            ref:"books"}
    
    ],
    orders:[
        {type:mongoose.Types.ObjectId,
            ref:"orders"}
    
    ]
},{
    timestamps:true
})

module.exports = mongoose.model("users",user)
