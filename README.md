# Issue Management REST API

## Description

This project is a fully functional REST API designed to manage issue entities within projects. Issues are critical for tracking problems and bugs in applications, allowing developers and testers to collaborate effectively. The API provides endpoints for creating, listing, updating, and tracking revisions of issues while ensuring robust authentication and audit logging.

This project was built with a focus on scalability, security, and adherence to REST API best practices.

## Features

- **Create, Read, Update Issues**: Core functionality to manage issues with validations and error handling.
- **Issue Revisions**: Every modification to an issue is tracked as a revision, including details about what was changed, by whom, and when.
- **Authentication**: Ensures secure access to the API using JWT-based authentication.
- **Change Tracking**: Stores author details (`created_by` and `updated_by`) for all database modifications.
- **Revision Comparison**: Enables comparison between two revisions of an issue, highlighting changes and providing a summary of differences.
- **Dockerized Setup**: Simplified local development and deployment with Docker Compose.

## Development Environment

This project is containerized for ease of setup and portability. Follow the steps below to run the project locally:

1. **Install Docker**: Ensure Docker and Docker Compose are installed on your machine.

2. **Run the Application**:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the API**:
   - The REST API is available at: `http://localhost:8080`.
   - The database is accessible locally at `localhost:3307` using any MySQL client. Use the credentials provided in the `.env` file.

## Technical Overview

- **Backend Framework**: [Node.js](https://nodejs.org) with [Koa](http://koajs.com/)
- **Database**: MySQL
- **ORM**: [Sequelize](http://docs.sequelizejs.com/)
- **Authentication**: JWT
- **Containerization**: Docker Compose

### Example Issue Format

Each issue is stored with the following structure:

```json
{
    "id": 123,
    "title": "Bug in issue-service",
    "description": "Ah snap :("
}
```

### Revision Format

Revisions track the state of an issue after any change:

```json
{
    "issue": {
        "title": "Bug in issue-service",
        "description": "It does not generate revisions"
    },
    "changes": {
        "description": "It does not generate revisions"
    },
    "updatedAt": "2024-03-29T15:40:42.000Z"
}
```

## Endpoints

### Core Functionality
- **Create Issue**: Create a new issue in the system.
- **List Issues**: Retrieve all stored issues with pagination.
- **Update Issue**: Modify an existing issue, storing the changes as a revision.

### Revisions
- **Create Revision**: Automatically logs revisions when creating or updating an issue.
- **List Revisions**: Retrieve all revisions of a specific issue.
- **Compare Revisions**: Compare two revisions of an issue and summarize the differences.

### Authentication
- **Secure Access**: All endpoints require a valid JWT token, except for health, discovery and auth endpoints.

## Highlights

- **Validation**: Comprehensive input validation ensures data consistency.
- **Error Handling**: Well-structured error messages and codes for client and server-side issues.
- **Audit Logging**: Tracks who made changes and when for transparency and accountability.
- **Revision Comparison**: Provides detailed insights into how issues evolve over time.

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in the `.env` file.

4. Run the application:
   ```bash
   npm run start
   ```

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