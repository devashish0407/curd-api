//claude generate code 

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./api.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- In-memory data store ---
let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Walk the dog', done: false },
  { id: 3, title: 'Finish assignment', done: true },
];
let nextId = 4; // tracks the next id to hand out, so it never collides

// --- Helpers ---
function findTask(id) {
  return tasks.find((t) => t.id === id);
}

function isBlank(str) {
  return typeof str !== 'string' || str.trim() === '';
}

// --- Meta routes ---
app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Task routes ---
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (isBlank(title)) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = { id: nextId++, title: title.trim(), done: false };
  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const { title, done } = req.body;

  if (title !== undefined) {
    if (isBlank(title)) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done must be true or false' });
    }
    task.done = done;
  }

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  tasks.splice(index, 1);
  res.status(204).end();
});

// --- Docs ---
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// --- 404 fallback for anything not matched above ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Central error handler (catches JSON parse errors, etc.) ---
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: 'Invalid request' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});