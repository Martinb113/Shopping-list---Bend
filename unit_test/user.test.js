const request = require('supertest');
const app = require('../testServer'); // Adjust the path as needed
let createdUserId;


  
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        username: 'Bubu',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app).post('/api/users/register').send(newUser);
      expect(response.statusCode).toBe(201); // Assuming 201 for successful creation
      expect(response.body).toHaveProperty('userId');
      createdUserId = response.body.userId; 
      // Additional assertions as needed
    });

    // Add tests for error scenarios (e.g., user already exists, invalid data)
  });

  describe('POST /api/users/login', () => {
    it('should log in an existing user', async () => {
      const userCredentials = {
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app).post('/api/users/login').send(userCredentials);
      expect(response.statusCode).toBe(200); // Assuming 200 for successful login
      expect(response.body).toHaveProperty('token');
      // Additional assertions as needed
    });

    // Add tests for error scenarios (e.g., incorrect credentials)
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete the created user', async () => {
      // Ensure the user ID is set
      if (!createdUserId) {
        throw new Error('User ID not set. User creation test may have failed.');
      }

      const response = await request(app)
        .delete(`/api/users/${createdUserId}`);
      
      expect(response.statusCode).toBe(200); // Assuming 200 for successful deletion
      expect(response.body).toHaveProperty('message', 'User account deleted successfully');
      // Additional assertions as needed
    });
  });
  // Additional test suites for other user-related endpoints like profile view, update, delete, etc.

