import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

const app = express();

// CORS configuration (relaxed in development)
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
	const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
	app.use(cors({ origin: allowedOrigin, credentials: true }));
	app.options('*', cors({ origin: allowedOrigin, credentials: true }));
} else {
	app.use(cors({ origin: true, credentials: true }));
	app.options('*', cors({ origin: true, credentials: true }));
}

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/applications', applicationRoutes);

// Global error handler
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	const status = err.status || 500;
	res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Failed to connect to database:', error);
		process.exit(1);
	}); 