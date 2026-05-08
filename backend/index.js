const axios = require('axios');
const Task = require('./models/Task');

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

// Auth routes
app.use('/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

// Home route
app.get('/', (req, res) => {
    res.send('Backend running');
});

// Add task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    await task.save();

    res.json(task);
});

// Get tasks
app.get('/tasks', async (req, res) => {

    const { userEmail } = req.query;

    const tasks = await Task.find({
        userEmail
    });

    res.json(tasks);
});

// Delete single task
app.delete('/tasks/:id', async (req, res) => {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
        message: "Deleted"
    });
});

// Delete ALL tasks
app.delete('/tasks', async (req, res) => {

    await Task.deleteMany({});

    res.json({
        message: "All tasks deleted"
    });
});

// Toggle done
app.put('/tasks/:id', async (req, res) => {

    const updated = await Task.findByIdAndUpdate(

        req.params.id,

        {
            done: req.body.done
        },

        {
            new: true
        }
    );

    res.json(updated);
});

// AI advice route
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

// Start server
const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
