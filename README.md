### Completed Tasks
1. **Initial Project Setup**
   - Setting up Node.js and Express.js.
   - Basic server setup with `server.js`.
   - Installation of primary packages like `express`, `mongoose`, `body-parser`, and `cors`.

2. **Database Connection** - still not working properly
   - MongoDB connection established using Mongoose in `server.js`.
   - Usage of environment variables for secure connection string handling.

3. **Basic Route Setup**
   - Creation of basic route files (`users.js`, `lists.js`, `items.js`).

4. **Models**
   - `User` model has been created and aligned with your schema.
   - Guidance provided for creating `List` and `Item` models.

5. **Environment Configuration**
   - Setup of `.env` file for managing environment variables like database connection strings.

6. **Complete Models Implementation**
   - Finalize and implement the `List` and `Item` models as per the provided schema.

7. **Route Logic Implementation** - Partially implemented
    - Implement the CRUD operations and business logic in the routes (`users.js`, `lists.js`)

8. **User Authentication and Authorization**
   - Implement user registration and login functionality.

9. **Roles and Permissions**
   - Partially done - inlist I have done this for `Create a List` & `Update a List`.

10. **Error Handling** - Partially done
   - Implement comprehensive error handling across the application.




### Tasks to be Completed, redone or checked

2. **Route Logic Implementation**
   - Implement the CRUD operations and business logic in the routes (`items.js`).

3. **User Authentication and Authorization**
   - Setup JSON Web Token (JWT) or another authentication mechanism for protecting routes.

4. **Roles and Permissions**
   - Implement logic to handle 'Owner' and 'Contributor' roles in the `List` model
        - remaining: `Delete a List`, `Add Item to Shopping List`, `Mark Item as Completed`.
   - Ensure that API routes check for proper permissions based on these roles.

5. **Input Validation and Sanitization**
   - Integrate input validation and sanitization in the routes to ensure data integrity and security.

6. **Error Handling**
   - Implement comprehensive error handling across the application.

7. **Testing**
   - Test all API endpoints, ensuring they work as expected and handle errors properly.
