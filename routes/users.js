const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const { check, validationResult } = require('express-validator');


// User Registration
router.post('/register', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    // Add more validation rules as needed
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with email and optional nickname
        const user = new User({ 
            email: req.body.email,
            nickname: req.body.nickname || null,
            password: hashedPassword 
        });
        await user.save();

        res.status(201).json({ userId: user._id, success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error in registering user HELO' });
    }
});

// User Login (using JWT for token generation)
router.post('/login', async (req, res) => {
    try {
        // Check if user exists with the given email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ userId: user._id, token, success: true, message: 'Login successful' });
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

// Update User Profile (only nickname can be updated, email remains the same)
router.put('/profile/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId, 
            { nickname: req.body.nickname || null }, 
            { new: true }
        ).select('-password');
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

// Change Password (requires old and new password)
router.put('/change-password/:userId', async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);

        // Check if the old password provided matches the stored password
        const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);

        // If the old password is incorrect, return an error response
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect old password' });
        }

        // Generate a new salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        // Update the user's password with the new hashed password
        user.password = hashedPassword;

        // Save the updated user object
        await user.save();

        // Return a success response
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while changing the password' });
    }
});

module.exports = router;
