// server.js
import express from 'express';
import cors from 'cors';

// Import all routes
import riskRoutes from './routes/riskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import hazardRoutes from './routes/hazardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use routers as middleware with their respective base paths
app.use('/api', riskRoutes);      // ini harusnya api/risk
app.use('/api/categories', categoryRoutes);
app.use('/api/hazards', hazardRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});