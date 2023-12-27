const express = require('express');
const Item = require('../models/item'); // Replace with your actual Item model path
const router = express.Router();


//Add Item to Shopping List
router.post('/', async (req, res) => {
    // Logic to add an item to a shopping list
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        listId: req.body.listId,
        //owner: req.body.owner
    });
    try {
        await newItem.save();
        res.status(201).json({
            itemId: newItem._id,
            success: true,
            message: 'Item added to shopping list successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

// Update an Item
router.put('/update/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, quantity, status } = req.body;

        // Find and update the item
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Update item details
        if (name) item.name = name;
        if (quantity) item.quantity = quantity;
        if (status) item.status = status;

        await item.save();
        res.status(200).json({ success: true, message: 'Item updated successfully', item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete an Item
router.delete('/delete/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Find and delete the item
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await item.remove();
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark Item as Completed
router.put('/complete/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Find the item and update its status to 'Completed'
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        item.completed = true; // Assuming there's a 'completed' field in the Item model
        await item.save();

        res.status(200).json({ success: true, message: 'Item marked as completed', item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});




module.exports = router;
