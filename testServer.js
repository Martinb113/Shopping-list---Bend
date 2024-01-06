const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const listsRoutes = require('./routes/lists');
const itemsRoutes = require('./routes/items');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(cors());

require('dotenv').config();npm test
// Choose the right database URI
const dbURI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to MongoDB...');
    }
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));
  
// API routes
app.use('/api/users', usersRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/items', itemsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Test Server for Shopping List API');
});

// No need to start the server with app.listen()

module.exports = app;
