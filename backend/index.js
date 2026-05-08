const Task = require('./models/Task');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const { GoogleGenerativeAI } = require("@google/generative-ai");


const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});


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
app.post('/ai', async (req, res) => {

    try {

        const { tasks, mood } = req.body;

        const prompt = `
        You are an adaptive productivity assistant.

        Analyze the user's productivity state.

        Tasks:
        ${tasks}

        Mood:
        ${mood}

        Give:
        1. Productivity suggestions
        2. Time management advice
        3. Burnout prevention tips
        4. Focus improvement techniques

        Keep response short and practical.
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({
            advice: response
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "AI generation failed"
        });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));

