const router = require("express").Router();
const User = require("../schema/user");
const bcrypt = require("bcrypt");

// Signup Functionality
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check for username length should be more than 6
        if (username.length < 6) {
            return res.status(400).json({ message: "Username length should be more than 6 characters" });
        }

        // Check duplicate username
        let existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "User exists" });
        }

        // Check duplicate email Id
        let existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email address exists" });
        }

        // Check password length
        if (password.length < 5) {
            return res.status(400).json({ message: "Password length should be more than 5 characters" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is a common value for salt rounds

        // Create and save the new user
        let newUser = new User({
            username,
            email,
            password: hashedPassword,
            address
        });

        await newUser.save();
        res.status(200).json({ message: "User Created" });
        console.log("User Created");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
