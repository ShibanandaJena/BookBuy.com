const jwt = require("jsonwebtoken")
require("dotenv").config();

const Authenticate = (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    // console.log(req.headers)
    const token = authHeader && authHeader.split(" ")[1]

    if(token == null){
        return res.status(400).json({message:"No token found"})
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(400).json({message:"Invalid token"})
        }
        req.user = user
        next();
    })
}

module.exports = {Authenticate};