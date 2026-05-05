const Task = require('./models/Task');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

app.get('/', (req, res) => {
    res.send('Backend running');
});
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// delete ALL tasks
app.delete('/tasks', async (req, res) => {
    await Task.deleteMany({});
    res.json({ message: "All tasks deleted" });
});
app.put('/tasks/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    { done: req.body.done },
    { new: true }
  );
  res.json(updated);
});
app.listen(5000, () => console.log('Server running on port 5000'));