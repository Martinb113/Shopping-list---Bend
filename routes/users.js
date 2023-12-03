const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Replace with your actual User model path, in case I will be moving staff arround
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists, I need to understand what exactly this is checking (Name, email?)
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the password, this I need to learn more
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const user = new User({ 
            username: req.body.username, 
            password: hashedPassword 
        });
        await user.save();

        res.status(201).send({ userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).send('Error in registering user.');
    }
});

// User Login (pseudo-code, needs jwt for token generation)
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send('Invalid username or password.');
        }

        // Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid username or password.');
        }

        // Generate token (use jsonwebtoken)
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // res.status(200).send({ token });
    } catch (error) {
        res.status(500).send('Error in user login.');
    }
});

module.exports = router;
