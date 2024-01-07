const request = require('supertest');
const app = require('../testServer'); // Adjust the path as needed
let createdListId;

  describe('POST /api/lists/create', () => {
    it('should create a list with valid data', async () => {
      const newListData = {
        title: "Grocery List",
        owner: "65909b9e51b1f4f71c2b9a8b",
        contributors: [],
        items: []
      };
  
      const response = await request(app).post('/api/lists/create').send(newListData);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('list');
      expect(response.body.list).toHaveProperty('_id');
      // Additional assertions as needed
      createdListId = response.body.list._id;
      
    }, 100000);

    it('should not create a list with missing title', async () => {
      const invalidListData = {
        // Missing title
        owner: "validUserId",
        contributors: ["contributorId"],
        items: ["item1", "item2"]
      };
    
      const response = await request(app).post('/api/lists/create').send(invalidListData);
      expect(response.statusCode).toBe(500); // Or appropriate error code
      // Additional assertions for error message
    }); 

    it('should not create a list with invalid user id (owner)', async () => {
      const invalidListData = {
        title: "Grocery List",
        owner: "65909b9e51b1f4f71c2b9a8",
        contributors: ["contributorId"],
        items: ["item1", "item2"]
      };
    
      const response = await request(app).post('/api/lists/create').send(invalidListData);
      expect(response.statusCode).toBe(500); // Or appropriate error code
      // Additional assertions for error message
    }); 

    it('should not create a list with invalid user id (contributor)', async () => {
      const invalidListData = {
        title: "Grocery List",
        owner: "65909b9e51b1f4f71c2b9a8b",
        contributors: ["65909b9e51b1f4f71c2b9a8"],
        items: ["item1", "item2"]
      };
    
      const response = await request(app).post('/api/lists/create').send(invalidListData);
      expect(response.statusCode).toBe(500); // Or appropriate error code
      // Additional assertions for error message
    }); 
  }); 

  describe('GET /api/lists/list', () => {
    it('should fetch lists for a given user', async () => {
      const userId = '65909b9e51b1f4f71c2b9a8b'; // Use a valid userId for testing
      const response = await request(app).get(`/api/lists/list?userId=${userId}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('lists');
      // Add any other assertions relevant to your response structure
    }, 100000);

    it('should return error for invalid user ID', async () => {
      const userId = '65909b9e51b1f4f71c2b9a8';
      const response = await request(app).get(`/api/lists/list?userId=${userId}`);
  
      expect(response.statusCode).toBe(404); // Or another appropriate status code
      // Additional assertions for error response
    }, 100000);
  });

  describe('GET /api/lists/get/:id', () => {
    it('should fetch details of a list for a given valid list ID', async () => {
      const validListId = '6590af78a03d2ec4dd09930d'; // Replace with a valid list ID from your test data
  
      const response = await request(app).get(`/api/lists/get/${validListId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('list');
      // Here you can add more assertions to validate the details of the list
    });

    it('should return an error for an invalid or non-existent list ID', async () => {
      const invalidListId = '6590af78a03d2ec4dd09930s'; // Use an ID that does not exist in your test data
    
      const response = await request(app).get(`/api/lists/get/${invalidListId}`);
      expect(response.statusCode).toBe(500); // Or another appropriate error status code
      // Additional assertions for error message structure can be added here
    });
  });

  describe('PUT /api/lists/update/:id', () => {
    it('should update a list with valid changes', async () => {
      const validListId = '6590af78a03d2ec4dd09930d'; // Replace with a valid list ID from your test data
      const updateData = {
        title: "Updated List Title",
        contributors: [],
        // Include other fields that you expect to update
      };
  
      const response = await request(app).put(`/api/lists/update/${validListId}`).send(updateData);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'List updated successfully');
      // You can add more assertions here to validate the updated list data
    });

    it('should return an error for invalid update data or non-existent list ID', async () => {
      const invalidListId = '6590af78a03d2ec4dd09930'; // Use an ID that does not exist in your test data
      const invalidUpdateData = {
        title: "Updated List Title",
        contributors: [],
      };
    
      const response = await request(app).put(`/api/lists/update/${invalidListId}`).send(invalidUpdateData);
      expect(response.statusCode).toBe(500); // Or another appropriate error status code
      // Additional assertions for error message structure can be added here
    });
  });
  
  describe('DELETE /api/lists/delete/:id', () => {
    
    it('should return an error for unauthorized deletion attempt', async () => {
      // Assuming 'createdListId' is set by a successful creation test
      const unauthorizedUserId = 'unauthorizedUserId'; // Use an ID of a user not authorized to delete
    
      const response = await request(app)
        .delete(`/api/lists/delete/${createdListId}`)
        .send({ userId: unauthorizedUserId });
    
      expect(response.statusCode).toBe(403); // Assuming 403 Forbidden for unauthorized access
      expect(response.body).toHaveProperty('message'); // Check for error message
      // Additional assertions as needed
    });

    it('should return an error for a non-existent list ID', async () => {
      const nonExistentListId = '65909b9e51b1f4f71c2b9a8b'; // Use an ID that does not exist
  
      const response = await request(app)
        .delete(`/api/lists/delete/${nonExistentListId}`)
        .send({ userId: '65909b9e51b1f4f71c2b9a8b' }); // Adjust based on your API requirements
  
      expect(response.statusCode).toBe(404); // Assuming 404 Not Found for non-existent resource
      expect(response.body).toHaveProperty('message'); // Check for error message
      // Additional assertions as needed
    });
    
    it('should delete the created list', async () => {
      // Ensure the list ID is set
      if (!createdListId) {
        throw new Error('List ID not set. List creation test may have failed.');
      }
  
      const response = await request(app)
        .delete(`/api/lists/delete/${createdListId}`)
        .send({ userId: '65909b9e51b1f4f71c2b9a8b' }); // Adjust based on your API requirements
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Shopping list deleted successfully');
      
    }); 

    
});  

