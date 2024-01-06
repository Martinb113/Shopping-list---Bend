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
});
