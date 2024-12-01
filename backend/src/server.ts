import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { aiRoutes } from './routes/ai';
import { analyticsRoutes } from './routes/analytics';
import { preferencesRoutes } from './routes/preferences';
import { initializeSocket } from './services/socket.service';
import { corsOptions } from './config/cors';
import { connectDatabase } from './config/database';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

// Connect to database
connectDatabase();

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/preferences', preferencesRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;