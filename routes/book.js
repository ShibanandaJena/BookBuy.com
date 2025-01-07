const router = require("express").Router();
const User = require("../schema/user")
const Book = require("../schema/book")
const jwt = require("jsonwebtoken")
const {Authenticate} = require("../auth/userAuth")
require("dotenv").config();

//add book as admin
router.post('/add-book',Authenticate,async(req,res)=>{
    try {
        const { id } = req.headers;
        const {url,title,author,price,desc,language} = req.body;
        const user = await User.findById(id).select("role")

        if (user.role !== "admin"){
            return res.status(400).json({message:"You dont have permission to add book"})
        }
        const book = new Book({
            url:url,
            title:title,
            author:author,
            price:price,
            desc:desc,
            language:language
        })
        await book.save()
        res.status(200).json({message:"New book saved"})
    } catch (error) {
        return res.status(500).json({messsage:"Internal server error"})
    }
})

// Update book as admin
router.put('/update-book', Authenticate, async (req, res) => {
    try {
        const { bookid } = req.query;
        const { url, title, author, price, desc, language } = req.body;
  
        const updatedBook = await Book.findByIdAndUpdate(
            bookid,
            { url, title, author, price, desc, language },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book updated", book: updatedBook });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//delete book as admin
router.delete("/delete-book",Authenticate,async (req,res) => {
    try {
        const { bookid } = req.query;
        await Book.findByIdAndDelete(bookid)
        return res.status(200).json({messsage:"Book Deleted"})

    } catch (error) {
        return res.status(500).json({messsage:"Internal server error"})
    }
})

// Fetch all books
router.get("/fetch-all-books",async(req,res)=>{
    try {
        const books = await Book.find().sort({createdAt:-1})
        if(!books){
            return res.status(400).json({message:"No books found"})
        }
        return res.status(200).json(books)
        
    } catch (error) {
        return res.status(500).json({messsage:"Internal server error"})

    }
})

// Fetch limited books
router.get("/fetch-recent-books",async(req,res)=>{
    try {
        const books = await Book.find().sort({createdAt:-1}).limit(4)
        if(!books){
            return res.status(400).json({message:"No books found"})
        }
        return res.status(200).json(books)
        
    } catch (error) {
        return res.status(500).json({messsage:"Internal server error"})

    }
})

// Fetch book detail
router.get('/fetch-book-id/:bookid',async (req,res) => {
    try {
        const {bookid} = req.params
        const bookDetails = await Book.findById(bookid)
        if(!bookDetails){
            return res.status(400).json({message:"No book found with that Id"})
        }
        return res.status(200).json({status:"Success",data:bookDetails})
    } catch (error) {
        return res.status(500).json({messsage:"Internal server error"})
    }
})

module.exports = router;
