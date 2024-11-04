import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
  } else {
    console.log(`Server is running on port: ${port}`);
  }
});
