import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 
import connectDB from './config/connectDB.js'; // MongoDB connection
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
