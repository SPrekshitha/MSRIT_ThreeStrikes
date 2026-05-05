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