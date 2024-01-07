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

    it('should not add an item with missing name', async () => {
      const newItem = {
        // name is missing
        quantity: 2,
        listId: "6590af78a03d2ec4dd09930d"
      };
      const response = await request(app).post('/api/items/').send(newItem);
      expect(response.statusCode).toBe(500); // Assuming 400 for bad request
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

    it('should not retrieve items for a non-existent list', async () => {
      const response = await request(app).get(`/api/items/list/nonExistentListId`);
      expect(response.statusCode).toBe(500);
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

      const response = await request(app).put(`/api/items/update/${createdItemId}`).send(updatedItem);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item updated successfully');
    });

    it('should not update a non-existent item', async () => {
      const updatedItem = { name: 'Bread', quantity: 1 };
      const response = await request(app).put(`/api/items/update/nonExistentItemId`).send(updatedItem);
      expect(response.statusCode).toBe(500);
    });

    // ... Add tests for error scenarios ...
  });

  // Mark Item as Completed
  describe('PUT /api/items/complete/:id', () => {
    it('should mark an item as completed', async () => {
      const userId = "65909b9e51b1f4f71c2b9a8b"; // Replace with a valid user ID


      const response = await request(app).put(`/api/items/complete/${createdItemId}`).send({ userId });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item marked as completed');
    });

    it('should not mark a non-existent item as completed', async () => {
      const response = await request(app).put(`/api/items/complete/nonExistentItemId`).send({ userId: "65909b9e51b1f4f71c2b9a8b" });
      expect(response.statusCode).toBe(500);
    });

    // ... Add tests for error scenarios ...
  });

  // Delete an Item
  describe('DELETE /api/items/delete/:itemId', () => {
    it('should delete the specified item', async () => {
      const response = await request(app).delete(`/api/items/delete/${createdItemId}`); //${createdItemId}
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item deleted successfully');
    });

    it('should not delete a non-existent item', async () => {
      const response = await request(app).delete(`/api/items/delete/nonExistentItemId`);
      expect(response.statusCode).toBe(500);
    });
    

    // ... Add tests for error scenarios ...
  });

  // ... Additional cleanup if necessary ...
});