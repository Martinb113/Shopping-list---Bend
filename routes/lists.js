const express = require('express');
const List = require('../models/list'); // Replace with your actual List model path
const router = express.Router();

// Create a List
router.post('/', async (req, res) => {
    try {
        const list = new List({ 
            title: req.body.title, 
            owner: req.body.owner 
            // Add other fields as necessary
        });
        await list.save();
        res.status(201).send(list);
    } catch (error) {
        res.status(500).send('Error in creating list.');
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
