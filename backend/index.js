

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

app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

app.get('/', (req, res) => {
    res.send('Backend running');
});

// CREATE TASK
app.post('/tasks', async (req, res) => {

    const task = new Task(req.body);

    await task.save();

    res.json(task);
});

// GET TASKS
app.get('/tasks', async (req, res) => {

    const tasks = await Task.find();

    res.json(tasks);
});

// DELETE SINGLE TASK
app.delete('/tasks/:id', async (req, res) => {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
        message: "Deleted"
    });
});

// DELETE ALL TASKS
app.delete('/tasks', async (req, res) => {

    await Task.deleteMany({});

    res.json({
        message: "All tasks deleted"
    });
});

// TOGGLE DONE
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

// AI PRODUCTIVITY ADVICE
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

app.listen(5000, () => {

    console.log('Server running on port 5000');
});
