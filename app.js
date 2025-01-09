const express = require("express")
const app = express();
const connectDB = require("./db/dbConnect")
const cors = require("cors")
app.use(cors())
app.use(express.json())
const signup = require('./routes/userSignup')
const login = require('./routes/userLogin')
const info = require('./routes/userInfo')
const addBook = require('./routes/book')
const favorite = require('./routes/favorite')
const order = require('./routes/order')
const cart = require('./routes/cart');
const contact = require("./routes/contact");

require("dotenv").config();

const PORT = process.env.PORT || 9000;


// Database fetch
connectDB();

// Fetching the signup route
app.use('/api/v1',signup)

// Fetching the login route
app.use('/api/v1',login)

// Get user info
app.use('/api/v1',info)

// Get bookupdate info
app.use('/api/v1',addBook)

// Get bookupdate info
app.use('/api/v1',favorite)

// Get order info 
app.use('/api/v1',order)

// Get cart info 
app.use('/api/v1',cart)

// Get contact form info 
app.use('/api/v1',contact)

// Port Running
app.listen(PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
