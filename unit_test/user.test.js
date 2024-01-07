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
    }, 10000);

    it('should not register a user with an existing email', async () => {
        const newUser = {
          username: 'Bubu',
          email: 'newuser@example.com', // Email already used in the registration test
          password: 'password123'
        };
  
        const response = await request(app).post('/api/users/register').send(newUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Email already in use');
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
    }, 10000);

    it('should not log in with incorrect credentials', async () => {
        const userCredentials = {
          email: 'newuser@example.com',
          password: 'incorrectassword'
        };
  
        const response = await request(app).post('/api/users/login').send(userCredentials);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid email or password');
      });

    // Add tests for error scenarios (e.g., incorrect credentials)
  });

  describe('GET /api/users/profile/:userId', () => {
    it('should fetch the profile of the created user', async () => {
        if (!createdUserId) {
        throw new Error('User ID not set. User creation test may have failed.');
        }

        const profileResponse = await request(app).get(`/api/users/profile/${createdUserId}`);
        expect(profileResponse.statusCode).toBe(200);
        expect(profileResponse.body).toHaveProperty('username', 'Bubu');
        // Additional assertions to check other profile fields
    });
});


    describe('PUT /api/users/profile/:userId', () => {
        it('should update the user profile', async () => {
          if (!createdUserId) {
            throw new Error('User ID not set. User creation test may have failed.');
          }
    
          const updatedUsername = 'UpdatedUser';
          const updateResponse = await request(app)
            .put(`/api/users/profile/${createdUserId}`)
            .send({ username: updatedUsername });
    
          expect(updateResponse.statusCode).toBe(200);
          expect(updateResponse.body).toHaveProperty('message', 'Profile updated successfully');
    
          // Verify that the username was updated
          const profileResponse = await request(app).get(`/api/users/profile/${createdUserId}`);
          expect(profileResponse.body).toHaveProperty('username', updatedUsername);
        });

        it('should return an error for updating a non-existent user', async () => {
            const response = await request(app)
              .put(`/api/users/profile/nonExistentUserId`)
              .send({ username: 'NewUsername' });
      
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error updating profile');
          });
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

    it('should return an error for deleting a non-existent user', async () => {
        const response = await request(app)
          .delete(`/api/users/nonExistentUserId`);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error deleting account');
      });
  });
  // Additional test suites for other user-related endpoints like profile view, update, delete, etc.
