// Load environment variables from .env file
require('dotenv').config();
// Then, require mongoose
const mongoose = require('mongoose');
// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const listsRoutes = require('./routes/lists');
const itemsRoutes = require('./routes/items');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/api/users', usersRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/items', itemsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Shopping List API v3');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
