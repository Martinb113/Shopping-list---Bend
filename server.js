const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

// Example route for user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Here you would typically add logic to handle registration.
  res.json({
    message: 'User registered successfully',
    username,
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('Hello Pretty World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
