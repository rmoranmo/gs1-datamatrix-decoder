import express from 'express';
import cors from 'cors';
import { decodeGS1DataMatrix } from './decoder.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main decode endpoint
app.post('/api/decode', (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required and must be a string' });
    }

    // Only keep alphanumeric characters
    const cleanCode = code.replace(/[^A-Za-z0-9]/g, '');
    const decodedData = decodeGS1DataMatrix(cleanCode);
    res.json(decodedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
