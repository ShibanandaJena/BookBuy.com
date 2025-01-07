const router = require("express").Router();
const bcrypt = require("bcrypt")
const User = require("../schema/user")
const jwt = require("jsonwebtoken")
require("dotenv").config();

router.post('/login',async (req,res) => {
    try {
        const{email,password} = req.body

        let existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({message:"User does not exist"})
        }
        const passMatch = await bcrypt.compare(password,existingUser.password)
        if(!passMatch){
            return res.status(400).json({message:"Invalid Password! Try again"})
        }
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'1h'})

        console.log("User found")
        return res.status(200).json({id:existingUser._id,role:existingUser.role,token})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router;