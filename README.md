# SapphireIQ Notes/Task API

A Notes/Task REST API built to match the SapphireIQ Student Project Guide using Node.js, Express, MongoDB and Mongoose. It includes server/database setup, CRUD routes, request validation, centralized error handling, filtering, sorting and pagination.

## Features

- Health-check endpoint that reports MongoDB connection status
- MongoDB connection through Mongoose and environment variables
- Create, list, retrieve, update and delete tasks
- Schema validation and request validation with express-validator
- Consistent centralized JSON error responses
- Filtering by completion status, priority, tag and text search
- Allowlisted sorting by title, priority, due date, creation/update time or completion status
- Pagination using page and limit with total counts and page metadata
- Postman collection for endpoint testing

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Setup on macOS

1. Open Terminal in this project folder.
2. Install dependencies with: npm install
3. Create your local environment file with: cp .env.example .env
4. Edit .env and set MONGODB_URI to your local MongoDB or Atlas connection string. The default is for local MongoDB.
5. Start the development server with: npm run dev

The API defaults to http://localhost:5000. Keep the Terminal process running while testing.

## Task data model

- title: required string, trimmed, 1–120 characters
- description: optional string, maximum 2,000 characters
- completed: boolean, defaults to false
- priority: low, medium or high; defaults to medium
- dueDate: optional date
- tags: string array, maximum 20 tags and 40 characters per tag
- createdAt and updatedAt: automatically maintained by Mongoose

## Endpoints

Base URL: http://localhost:5000

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health and database status |
| POST | /api/tasks | Create a task |
| GET | /api/tasks | List tasks with filters, sorting and pagination |
| GET | /api/tasks/:id | Get a task by MongoDB ObjectId |
| PATCH | /api/tasks/:id | Update selected task fields |
| DELETE | /api/tasks/:id | Delete a task |

## Query parameters

- completed=true or false — filter by completion state
- priority=low, medium or high — filter by priority
- tag=backend — match a tag
- search=API — case-insensitive search in title and description
- sortBy=title, priority, dueDate, createdAt, updatedAt or completed
- sortOrder=asc or desc
- page=1 — 1-based page number
- limit=10 — page size from 1 to 100

Example query:
http://localhost:5000/api/tasks?completed=false&priority=high&tag=backend&search=API&sortBy=createdAt&sortOrder=desc&page=1&limit=10

## Example requests

Create a task using curl:

curl -X POST http://localhost:5000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Finish API project","description":"Complete CRUD and query features","priority":"high","tags":["college","backend"]}'

List tasks:
curl 'http://localhost:5000/api/tasks'

Health check:
Open http://localhost:5000/health. When MongoDB is connected, the response contains status=ok and database=connected.

## Errors

The API uses conventional HTTP status codes: 400 for invalid input, 404 when a task or route does not exist, 409 for duplicate-key conflicts, and 500 for unexpected errors. Validation responses include an error message and field-level details when available.

## Postman

Import postman/Notes-Task-API.postman_collection.json into Postman. Set the collection variable baseUrl to http://localhost:5000. Run Create task first, then copy its returned MongoDB _id into taskId for single-task requests.

## Security and scope

- This is a backend API; no frontend is included.
- The .env file is ignored by Git. Never commit database passwords, access tokens or other secrets.
- The project addresses the brief's four modules: server/database setup, CRUD routes, validation/error handling, and filtering/sorting/pagination.
