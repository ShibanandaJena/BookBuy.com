const { Authenticate } = require('../auth/userAuth')
const router = require('express').Router()
const Contact = require("../schema/contact")
const User = require("../schema/user")

// Submit Contact Form
router.post('/contact-form',Authenticate,async (req,res) => {
try {
    const { id } = req.headers
    const {title,message} = req.body
    const user = await User.findById(id).select('role')

    if(user.role !== 'user'){
        return res.status(400).json({message:"You are not allowed to submit the feedback form"})
    }

    const contact = new Contact({
        user:id,
        title:title,
        message:message
    })

    await contact.save()
    return res.status(200).json({message:"New form created"})

} catch (error) {
    return res.status(500).json({message:"Internal server error"})
}    
})

// Fetch all contact submissions
router.get('/get-all-form',Authenticate,async (req,res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).select('role')

        if (user.role !== "admin"){
            return res.status(400).json({message:"You dont have permission to add book"})
        }

        const contactData = await Contact.find()
            .populate({
                path:"user",
                select:"-password"
            }).sort({createdAt:-1})
        
        return res.status(200).json({status:"Success",data:contactData})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})

module.exports = router