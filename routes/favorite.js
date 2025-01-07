const router = require("express").Router();
const User = require("../schema/user")
const Book = require("../schema/book")
const {Authenticate} = require("../auth/userAuth");

// Add a book to a user fav list
router.put('/add-favorite',Authenticate,async (req,res) => {
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

        if(user.favorites.includes(bookid)){
            return res.status(400).json({message:"User has the book added to wishlist"})
        }
        user.favorites.push(bookid);
        await user.save();
        const getBook = await User.findById(id).select("-password")

        return res.status(200).json(getBook)

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})

// Remove from favorites
router.delete('/remove-favorite',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers
        const{bookid} = req.query

        if(!id || !bookid){
            return res.status(400).json({message:"No details found"})
        }

        const user = await User.findById(id)
        if(!user ){
            return res.status(400).json({message:"No user found"})
        }

        if(!user.favorites.includes(bookid)){
            return res.status(400).json({message:"User dont have the book"})
        }

        user.favorites = user.favorites.filter(item=>item.toString() !== bookid);
        await user.save();
        const updatedUser = await User.findById(id).select("-password")

        return res.status(200).json(updatedUser)

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})

//Get the favorites list
router.get('/favorite-list',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers

        if(!id ){
            return res.status(400).json({message:"No details found"})
        }

        const userData = await User.findById(id).populate("favorites");
        const favorite_list = userData.favorites

        return res.status(200).json({status:"Success",favorite_list})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router