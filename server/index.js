const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Defaulting to system DNS servers');
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Enable CORS for frontend clients
app.use(cors({
  origin: '*',
  credentials: true
}));

// API Root & Health Check Endpoint for Render / Uptime monitors
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'TripVault API',
    status: 'Active',
    author: 'Manjunatha K',
    message: 'TripVault backend is live and operational.'
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Core API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TripVault Server running on port ${PORT}`));