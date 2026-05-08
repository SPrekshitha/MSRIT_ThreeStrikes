const express = require('express');
const router = express.Router();

const users = require('../models/User');

// SIGNUP
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ name, email, password });

    res.json({ message: 'Signup successful' });
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
});

module.exports = router;