const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken'); Maybe needed later, I still havent figured out how this works, need to ask or findout
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

        res.status(201).json({ userId: user._id, username: user.username, success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in registering user' });
    }
});

// User Login (pseudo-code, needs jwt for token generation)
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        // Generate token (use jsonwebtoken)
    //  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //  res.status(200).json({ userId: user._id, token, success: true, message: 'Login successful' });
        
        // res.status(200).send({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in user login' });
    }
});

// View User Profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ ...user.toObject(), success: true, message: 'Profile retrieved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving profile' });
    }
});

// Update User Profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true }).select('-password');
        res.status(200).json({ userId: updatedUser._id, success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile' });
    }
});

// Delete User Account
router.delete('/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ success: true, message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
});

// Change Password
router.put('/change-password/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req);
    }
);


module.exports = router;
