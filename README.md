# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express as part of my internship coursework (Week 2, Assignment 1). Data is stored in memory (resets when the server restarts).

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

## AI vs Me — what I learned

I asked Claude to write its own version of `index.js` and compare it to mine. Both versions work and pass all the checkpoints — these are refinements, not bug fixes.

1. **Id generation** — I recalculate the next id every time with `Math.max(...tasks.map(t => t.id)) + 1`. Claude's version uses a `nextId` counter that just increments. Mine breaks if the task list is ever empty (`Math.max()` on an empty array returns `-Infinity`), and it's slower since it rescans the whole array on every POST.

2. **Validating `done` in PUT** — my PUT endpoint accepts whatever value is sent for `done` without checking its type, so `{"done": "yes"}` would silently store a string instead of a boolean. Claude's version checks `typeof done !== 'boolean'` and returns a 400 if it's not. Same "never trust the client" principle the assignment already taught me for `title`, just applied consistently.

3. **Catch-all 404 and error handler** — my app has no fallback for unmatched routes or malformed JSON, so Express shows its default HTML error page (I hit this myself with `Cannot GET /tasks` and a JSON parse error earlier). Claude's version adds a catch-all route handler plus a 4-argument error-handling middleware at the bottom, so unexpected input returns clean JSON instead of a stack trace.