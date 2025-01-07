const mongo = require("mongoose")
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI

const dbConnect = async ()=>{
    try {
        await mongo.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Mongo connected")
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = dbConnect;