import express, { json } from 'express';
import redditRoutes from './routes/redditRoutes.js';

const app = express();

// Middleware
app.use(json());

// Routes
app.use('/api', redditRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// 404 Middleware
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

export default app;