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
router.get('/:userId', async (req, res) => {
    // Logic to retrieve shopping lists for a user
    try {
        const lists = await List.find({ owner: req.params.userId });
        res.status(200).json({
            lists,
            success: true,
            message: 'Shopping lists retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//Update List
router.put('/:listId', async (req, res) => {
    // Logic to update a shopping list
    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.listId,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Shopping list updated successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Shopping List
router.delete('/:listId', async (req, res) => {
    // Logic to delete a shopping list
    try {
        await List.findByIdAndDelete(req.params.listId);
        res.status(200).json({
            success: true,
            message: 'Shopping list deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//Add Item to Shopping List
router.post('/', async (req, res) => {
    // Logic to add an item to a shopping list
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        listId: req.body.listId,
        owner: req.body.owner
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


//Mark Item as Completed
router.put('/:itemId', async (req, res) => {
    // Logic to mark an item as completed
    try {
        await Item.findByIdAndUpdate(
            req.params.itemId,
            { $set: { completed: req.body.completed

                
module.exports = router;
