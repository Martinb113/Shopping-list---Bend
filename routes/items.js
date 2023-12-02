const express = require('express');
const Item = require('../models/item'); // Replace with your actual Item model path
const router = express.Router();

// Add Item to a List
router.post('/', async (req, res) => {
    try {
        const item = new Item({ 
            name: req.body.name,
            quantity: req.body.quantity,
            listId: req.body.listId 
        });
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(500).send('Error in adding item.');
    }
});

// Get Items by List
router.get('/list/:listId', async (req, res) => {
    try {
        const items = await Item.find({ listId: req.params.listId });
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send('Error in retrieving items.');
    }
});

module.exports = router;
