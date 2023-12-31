const express = require('express');
const List = require('../models/list'); // Replace when change if path occures
const User = require('../models/user');
const Item = require('../models/item');
const router = express.Router();

/*require('dotenv').config();

// I dont have a middleware to authenticate and set req.user, this needsto be sorted
// ...

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Create a List

router.post('/create', authenticate, async (req, res) => {
    /*if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
*/

router.post('/create', async (req, res) => {
    const { title, contributors, items, owner } = req.body;

    const newList = new List({
        title,
        owner,
        contributors: contributors || [], // Optional contributors
        items: [] // Initialize items as an empty array
    });

    try {
        await newList.save();

        // Create items in the database and get their IDs
        const itemIds = await Promise.all(items.map(async (itemName) => {
            const newItem = new Item({
                name: itemName,
                listId: newList._id, // Set listId to the _id of the List document
                quantity: 1 // Set quantity to 1 or another default value
            });
            await newItem.save();
            return newItem._id;
        }));

        // Update the List document with the IDs of the Item documents
        newList.items = itemIds;
        await newList.save();

        res.status(201).json({
            list: newList,
            success: true,
            message: 'Shopping list created successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Get Lists by User
router.get('/list', async (req, res) => {
    try {
        // const userId = req.user._id; // Assuming user ID is available in the request
        const userId = req.query.userId; // Get user ID from query parameters

        // Fetch lists where user is the owner
        const ownerLists = await List.find({ owner: userId });
        
        // Fetch lists where user is a contributor
        const contributorLists = await List.find({ contributors: userId });

        // Combine the lists
        const lists = {
            ownerLists: ownerLists,
            contributorLists: contributorLists
        };

        // Respond with success message
        res.status(200).json({
            lists,
            success: true,
            message: 'Shopping lists retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/*
Viewing Detailed List Information: 
    When a user selects a shopping list from a list of summaries to view its full details, 
    including all items and their statuses.
Editing a List: 
    Before editing a list, the application needs to retrieve its current details so the user can see what changes are to be made.
*/
router.get('/get/:id', async (req, res) => {
    try {
        const listId = req.params.id;

        // Find the list by ID
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ success: false, message: 'List not found' });
        }

        // Respond with the list and success message
        res.status(200).json({
            list,
            success: true,
            message: 'Shopping list retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


//Update List - Use the List Update Endpoint for Major Changes -  efficient for bulk iTEM changes.
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { items, ...updates } = req.body;

        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ success: false, message: 'List not found' });
        }

        // Update fields other than items
        Object.keys(updates).forEach((update) => list[update] = updates[update]);

        // Add new items to the items array
        if (items) {
            list.items = [...(list.items || []), ...items];
        }

        await list.save();

        res.status(200).json({ success: true, message: 'List updated successfully', list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Delete Shopping List - If the user is the owner, proceed with the deletion. Otherwise, return an unauthorized error.
router.delete('/delete/:id',  async (req, res) => {
    try {
        const listId = req.params.id;
        const userId = req.body.userId; // Get user ID from request body
        //const userId = req.user._id; // Assuming user ID is available from authentication

        // Find the list by ID
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ success: false, message: 'List not found' });
        }

        // Check if the user is the owner
        if (list.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Delete the list
        await List.findByIdAndDelete(listId);
        res.status(200).json({ success: true, message: 'Shopping list deleted successfully' });
    } catch (error) {
        
        console.log(error); // Add this line
        res.status(500).json({ success: false, message: error.message });
    }
});

//Mark List as Completedss
router.put('/archive/:id', async (req, res) => {
    try {
        const listId = req.params.id;
        const userId = req.body.userId; // Get user ID from request body
        //const userId = req.user._id; // User ID from authentication


        // Find the list and verify owner or contributor
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ success: false, message: 'List not found' });
        }

        if (list.owner.toString() !== userId.toString() && !list.contributors.includes(userId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Update the list status to 'Archived'
        list.status = 'Archived';
        await list.save();

        res.status(200).json({ success: true, message: 'Shopping list marked as archived' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;
