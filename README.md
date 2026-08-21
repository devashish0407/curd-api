# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express as part of my internship coursework (Week 2 & 3 Assignments). Data is stored in a SQLite database, so it survives server restarts.

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

## Database

This API uses **SQLite** (via `better-sqlite3`) instead of an in-memory array.

**Why SQLite:** it's a lightweight, file-based database with no separate server to install or run — perfect for a small project like this. It also demonstrates the core idea of separating the API layer from the data layer: the endpoints, request bodies, and responses are identical to the in-memory version, only the storage underneath changed.

**Where it's stored:** the database lives in a single file, `tasks.db`, created automatically in the project root the first time the server runs. It's excluded from Git via `.gitignore`, since it's local data, not source code — anyone who clones this repo gets a fresh, auto-seeded database on first run.

**Example query I ran** (in DB Browser for SQLite, Execute SQL tab):
```sql
UPDATE tasks SET done = 1;
```
This marked every task as done directly in the database — and `GET /tasks` immediately reflected the change with zero code changes, confirming the API reads live from the database file.

**Screenshot:**

![DB Browser screenshot](.img/updated-db.png)

## Running it

```bash
npm install
node index.js
```

Server runs on `http://localhost:3000`. On first run, `tasks.db` is created automatically with 3 example tasks. On future runs, your existing data is preserved.

## API docs

Interactive Swagger UI is available at `http://localhost:3000/docs` once the server is running.

## Example requests

```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE http://localhost:3000/tasks/1
```

## AI vs Me — what I learned (W2 CRUD API)

I asked Claude to write its own version of `index.js` and compare it to mine. Both versions work and pass all the checkpoints — these are refinements, not bug fixes.

1. **Id generation** — I recalculate the next id every time with `Math.max(...tasks.map(t => t.id)) + 1`. Claude's version uses a `nextId` counter that just increments. Mine breaks if the task list is ever empty (`Math.max()` on an empty array returns `-Infinity`), and it's slower since it rescans the whole array on every POST.

2. **Validating `done` in PUT** — my PUT endpoint accepts whatever value is sent for `done` without checking its type, so `{"done": "yes"}` would silently store a string instead of a boolean. Claude's version checks `typeof done !== 'boolean'` and returns a 400 if it's not. Same "never trust the client" principle the assignment already taught me for `title`, just applied consistently.

3. **Catch-all 404 and error handler** — my app has no fallback for unmatched routes or malformed JSON, so Express shows its default HTML error page (I hit this myself with `Cannot GET /tasks` and a JSON parse error earlier). Claude's version adds a catch-all route handler plus a 4-argument error-handling middleware at the bottom, so unexpected input returns clean JSON instead of a stack trace.
