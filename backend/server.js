import path from 'path';
import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { fileURLToPath } from 'url';

connectDB();

const port = process.env.REACT_APP_PORT || 8001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Your API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// -------- Serve frontend in production --------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.REACT_APP_NODE_ENV === 'production') {
  // Serve compiled React bundle
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Fallback to index.html for any unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  // Development mode
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Custom error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.REACT_APP_NODE_ENV} mode on port ${port}`
  );
});
