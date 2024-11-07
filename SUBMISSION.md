## Submission Guide - Hamza Hassan (hassanhamza0101@gmail.com)

### Installation and Setup

- **Install dependencies:**

   Make sure you have `Node.js` and `npm` installed on your machine, then run:

   ```bash
   npm install
   ```

### Environment Configuration

The application uses three different .env files to manage configuration settings for different environments. Each environment file provides the necessary configuration values for its respective environment:

- `.env`: Used by Docker to set environment variables for the production environment. Typically contains production-specific settings.
- `.env.development`: Used for development environment settings when running locally. This file includes configurations suitable for development, like development database credentials and debugging options.
- `.env.test`: Used exclusively for the testing environment. This file configures settings for running the test suite, including using an in-memory SQLite database for isolation.

### Running the Application

The application includes several scripts for different environments and tasks:

- **Build the Project:**

  Compile the TypeScript code into JavaScript. The output will be saved in the `dist` folder.

  ```bash
  npm run build
  ```

- **Start the Server:**

  After building, you can start the server using:

  ```bash
  npm run start
  ```

  This will execute the compiled `index.js` file in the `dist` folder and start the server.

- **Run the Server in Development Mode:**

  For development, use the following command. It will use `ts-node-dev` to run `index.ts` directly and automatically reload on code changes.

  ```bash
  npm run dev
  ```

  The server will be available at http://localhost:8080.



### Database Migrations

To manage database migrations, two scripts are provided:

- **Run Migrations:**

  Apply all pending migrations.

  ```bash
  npm run migrate
  ```

- **Undo Migrations:**

  Roll back migrations.

  ```bash
  npm run migrate:undo
  ```

### API Documentation

To bundle the API documentation, which is located in `docs/api.yaml`, into a single file:

- **Bundle API Documentation:**

  This will generate `bundled-api.yaml` in the `docs` folder.

  ```bash
  npm run bundle-spec
  ```

  You can then checkout the API documentation at http://localhost:8080/docs.
  > NOTE: After making changes in the docs/**, rebuild using the above command 
  > and restart the server for changes to take effect


### Running Tests

To run the test suite, use:

```bash
npm run test
```

This command sets `NODE_ENV` to `test` and executes tests using **Jest**. The tests use an in-memory SQLite database to isolate the test environment from development and production data.

### Tradeoffs and Decisions Made

During the development of this project, certain tradeoffs and design decisions were made to balance development speed, maintainability, and simplicity:

1. **Testing Scope**: The current setup includes only unit tests for models; it could be expanded to cover API endpoints and utility functions for more comprehensive test coverage.

2. **Code Formatting**: ESLint and Prettier are not yet configured, so adding them in the future would help maintain a consistent code style across the project.

3. **Project Structure**: The original project structure was mostly retained during the TypeScript conversion. This can be adapted to a more conventional `src/`-based layout for better organization and scalability.

4. **Selective Package Use**: Packages were kept minimal to avoid unnecessary dependencies. For example, database migrations are managed with TypeScript files rather than sequelize-cli due to the simplicity of the migration needs.

5. **Important Note on Error Handling**:  The project includes basic error handling for specific HTTP statuses, such as `400 Bad Request`. For example:

```typescript
badRequest: (context, errors): void => {
  context.body = {
    message: "Check your request parameters",
    errors,
  };
  context.status = 400;
}
```

Currently, this handler provides detailed error information, which is helpful in development but may expose sensitive data in production.

#### Future Enhancements:

- **500 Internal Server Error**: A general `500 Internal Server Error` handler can be added to manage unexpected errors gracefully. This would ensure the user receives a generic error message without exposing details of the error.

   ```typescript
   internalServerError: (context, error): void => {
     context.body = {
       message: "An internal server error occurred",
       error: {
         message: error.message,
         name: error.name,
       },
     };
     context.status = 500;
   }
   ```

- **Limited Error Details**: For production, limiting error exposure is recommended. Instead of returning the full error object (e.g., `errors`), the response could include only the `message` and `name` of the error, providing enough information for debugging without revealing sensitive details. This approach enhances security and keeps responses user-friendly.