const router = require("express").Router();
const User = require("../schema/user")
const { Authenticate } = require("../auth/userAuth")
require("dotenv").config();

router.get('/info',Authenticate,async(req,res)=>{
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select("-password")
        // console.log(" User founded ")
        return res.status(200).json(data)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
},

router.put('/update-info',Authenticate,async(req,res)=>{
    try {
        const { id } = req.headers;
        const { address } = req.body;

        await User.findByIdAndUpdate(id,{address:address})
        return res.status(200).json({message:"Address updated"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
    
)

module.exports = router