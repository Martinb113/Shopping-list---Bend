const request = require('supertest');
const app = require('../testServer'); // Adjust the path as needed
//const createdListId = "6590af78a03d2ec4dd09930d";
//const createdItemId = "6591b8ca5ed5658e2e794037";
let createdItemId;

describe('Item Routes', () => {
  // Add Item to Shopping List
  describe('POST /api/items', () => {
    it('should add a new item to the list', async () => {
      const newItem = {
        name: "Milk",
        quantity: 2,
        listId: "6590af78a03d2ec4dd09930d" //createdListId
      };
  
      const response = await request(app).post('/api/items/').send(newItem); // Notice the '/' at the end
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('itemId');
      createdItemId = response.body.itemId;
    });

    // ... Add tests for error scenarios ...
  });

  // Get Items by List
  describe('GET /api/items/list/:listId', () => {
    it('should retrieve items for a given list', async () => {
      const response = await request(app).get(`/api/items/list/60d3b41c8534a2d3357d5f3b`); //${createdListId}
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    // ... Add tests for error scenarios ...
  });

  // Update an Item
  describe('PUT /api/items/update/:itemId', () => {
    it('should update the specified item', async () => {
      const updatedItem = {
        name: 'Bread',
        quantity: 1
      };

      const response = await request(app).put(`/api/items/update/659a51a0e4b26b160f05cc9e`).send(updatedItem);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item updated successfully');
    });

    // ... Add tests for error scenarios ...
  });

  // Mark Item as Completed
  describe('PUT /api/items/complete/:id', () => {
    it('should mark an item as completed', async () => {
      const userId = "65909b9e51b1f4f71c2b9a8b"; // Replace with a valid user ID


      const response = await request(app).put(`/api/items/complete/659a51a0e4b26b160f05cc9e`).send({ userId });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item marked as completed');
    });

    // ... Add tests for error scenarios ...
  });

  // Delete an Item
  describe('DELETE /api/items/delete/:itemId', () => {
    it('should delete the specified item', async () => {
      const response = await request(app).delete(`/api/items/delete/659a5748243370758c06ba21`); //${createdItemId}
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item deleted successfully');
    });

    // ... Add tests for error scenarios ...
  });

  // ... Additional cleanup if necessary ...
});