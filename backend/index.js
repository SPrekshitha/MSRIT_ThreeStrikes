const axios = require('axios');
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
app.post('/ai', async (req, res) => {

    try {

        const { tasks, mood } = req.body;

        const prompt = `
        You are an adaptive productivity assistant.

        User mood:
        ${mood}

        Tasks/workload:
        ${tasks}

        Give:
        1. Productivity suggestions
        2. Time management advice
        3. Burnout prevention tips
        4. Focus improvement techniques

        Keep response short and practical.
        `;

        const response = await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            }
        );

        const advice =
            response.data
            .candidates[0]
            .content.parts[0]
            .text;

        res.json({
            advice
        });

    } catch (error) {

        console.log(error.response?.data || error.message);

                res.status(500).json({
                            error: "AI generation failed"
                                    });
                                        }
                                        });

                                        app.listen(5000, () => console.log('Server running on port 5000'));

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server running...');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
