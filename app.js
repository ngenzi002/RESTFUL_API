const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
