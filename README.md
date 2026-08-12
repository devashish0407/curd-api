# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express. Data is stored in memory (resets when the server restarts).

## Endpoints

| Method | Route         | Description                  |
|--------|---------------|-------------------------------|
| GET    | `/`           | API info                     |
| GET    | `/health`     | Health check                 |
| GET    | `/tasks`      | List all tasks               |
| GET    | `/tasks/:id`  | Get a single task by id      |
| POST   | `/tasks`      | Create a new task            |
| PUT    | `/tasks/:id`  | Update a task's title/done   |
| DELETE | `/tasks/:id`  | Delete a task                |

## Running it

```bash
npm install
node index.js
```

Server runs on `http://localhost:3000`.

## API docs

Interactive Swagger UI is available at `http://localhost:3000/docs` once the server is running.

## Example requests

```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE http://localhost:3000/tasks/1
```