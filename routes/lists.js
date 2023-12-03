const express = require('express');
const List = require('../models/list'); // Replace when change if path occures
const router = express.Router();

// Create a List
router.post('/', async (req, res) => {
    // Logic to create a new shopping list, will need to apudate later on
    
    const newList = new List({
        title: req.body.title,
        owner: req.body.owner
    });
    try {
        await newList.save();
        res.status(201).json({
            listId: newList._id,
            title: newList.title,
            success: true,
            message: 'Shopping list created successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Get Lists by User
router.get('/user/:userId', async (req, res) => {
    try {
        const lists = await List.find({ owner: req.params.userId });
        res.status(200).send(lists);
    } catch (error) {
        res.status(500).send('Error in retrieving lists.');
    }
});

module.exports = router;
