// server.js
import express from 'express';
import cors from 'cors';
// Impor router dengan benar
import riskRoutes from './routes/riskRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gunakan router sebagai middleware
// Penting: riskRoutes adalah fungsi router yang diekspor, bukan objek
app.use('/api', riskRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});