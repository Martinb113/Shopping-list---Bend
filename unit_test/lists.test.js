const request = require('supertest');
const app = require('../testServer'); // Adjust the path as needed

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
      }, 100000);
});

});
