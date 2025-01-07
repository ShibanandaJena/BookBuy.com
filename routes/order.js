const router = require("express").Router();
const User = require("../schema/user")
const Book = require("../schema/book")
const Order = require("../schema/order")
const { Authenticate } = require("../auth/userAuth")

// User add order ---- Approach - 1
// router.post('/place-order', Authenticate, async (req, res) => {
//     try {
//         const { id} = req.headers; // Extract user ID and book ID from headers
//         // Validate inputs
//         if (!id) {
//             return res.status(400).json({ message: "User ID or Book ID is missing" });
//         }

//         // Check if user exists
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const cart_list = user.cart
//         // console.log(cart_list)
//         for (let item in cart_list){
//             let bookid = cart_list[item]
//             let book = await Book.findById(bookid);

//             let order = new Order({
//                     user: id,
//                     book: book._id,
//                 });
//             await order.save();
            
//             user.orders.push(order._id);
//             await user.save();


//         }

//         user.cart = []
//         await user.save()

//         return res.status(201).json({ message: "Order created successfully"});

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// })

// User add order ---- Approach - 2
router.post('/place-order', Authenticate, async (req, res) => {
    try {
        const { id} = req.headers; 
        const {order} = req.body;        

        // Validate inputs
        if (!id) {
            return res.status(400).json({ message: "User ID or Book ID is missing" });
        }

        // Validate order
        if (!order) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        for (const orderData of order){
            const newOrder = new Order({user:id,book:orderData._id})
            const orderDatafromDb = await newOrder.save()

            await User.findByIdAndUpdate(id,{
                $push:{orders:orderDatafromDb._id}
            })

            await User.findByIdAndUpdate(id,{
                $pull:{cart:orderData._id}
            })
        }

        return res.status(201).json({ message: "Order created successfully"});

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// User side order history fetch
router.get('/get-order-history', Authenticate, async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id).populate({
        path: 'orders',
        populate: {
          path: 'book',  // Populate the book field within each order
          model: 'books', // Ensure the model name is 'Book'
        },
      }); 
  
      if (!userData) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const order_list = userData.orders.reverse(); // Reverse the order history if needed
      if (order_list.length === 0) {
        return res.status(400).json({ message: "No orders found" });
      }
  
      // Send the full order data, or adjust as needed (e.g., sending just IDs or specific fields)
      return res.status(200).json({
        status: "Success",
        orders: order_list // This will now send the full order data
      });
  
    } catch (error) {
      console.error(error); // Log the error to server logs
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  

// Get all orders --admin
router.get('/get-all-orders',Authenticate,async (req,res) => {
    try {
        const {id} = req.headers
        const user = await User.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })  
        }
        const role = user.role
        if(role ==="user"){
            return res.status(400).json({ message: "User do not have access to all orders" })  
        }
        const userData = await Order.find()
            .populate({
                path:"book"
            })
            .populate({
                path:"user"
            })
            .sort({createdAt:-1})

        return res.status(200).json({status:"Success",data:userData})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})


// Update order --admin
router.put('/update-order-status/:orderid',Authenticate,async(req,res)=>{
    try {
        const {id} = req.headers
        const {orderid} = req.params
        const {order_status} = req.body

        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({ message: "User not found" })  
        }
        const role = user.role
        if(role ==="User"){
            return res.status(400).json({ message: "User do not have access to all orders" })  
        }

        await Order.findByIdAndUpdate(orderid,{
            status:order_status
        })
        

        return res.status(200).json({status:"Success",message:"Order successful"})

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router;