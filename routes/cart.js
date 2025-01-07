const router = require("express").Router();
const User = require("../schema/user")
const {Authenticate} = require("../auth/userAuth");

// Add a book to a user fav list
router.put('/add-to-cart',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers
        const{bookid} = req.body

        if(!id || !bookid){
            return res.status(400).json({message:"No details found"})
        }

        const user = await User.findById(id)
        if(!user ){
            return res.status(400).json({message:"No user found"})
        }

        if(user.cart.includes(bookid)){
            return res.status(400).json({message:"User has the book added to cart"})
        }
        user.cart.push(bookid);
        await user.save();
        const getBook = await User.findById(id).select("-password")

        return res.status(200).json(getBook)

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})

// Remove from favorites
router.delete('/remove-from-cart',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers
        const{bookid} = req.body

        if(!id || !bookid){
            return res.status(400).json({message:"No details found"})
        }

        const user = await User.findById(id)
        if(!user ){
            return res.status(400).json({message:"No user found"})
        }

        if(!user.cart.includes(bookid)){
            return res.status(400).json({message:"User dont have the book"})
        }

        user.cart = user.cart.filter(item=>item.toString() !== bookid);
        await user.save();
        const updatedUser = await User.findById(id).select("-password")

        return res.status(200).json(updatedUser)

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})

//Get the favorites list
router.get('/get-user-cart',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers

        if(!id ){
            return res.status(400).json({message:"No details found"})
        }

        const userData = await User.findById(id).populate("cart");
        const cart_list = userData.cart.reverse()

        return res.status(200).json({status:"Success",cart_list})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})


module.exports = router