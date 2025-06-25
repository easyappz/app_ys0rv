const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// MongoDB connection from global
const mongoDb = global.mongoDb;

// Define schema for operation history
const OperationSchema = new mongoose.Schema({
  firstOperand: { type: Number, required: true },
  secondOperand: { type: Number, required: true },
  operation: { type: String, required: true },
  result: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Operation = mongoDb.model('Operation', OperationSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { firstOperand, secondOperand, operation } = req.body;

    if (!firstOperand || !secondOperand || !operation) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let result;

    if (operation === '+') {
      result = firstOperand + secondOperand;
    } else if (operation === '-') {
      result = firstOperand - secondOperand;
    } else if (operation === '*') {
      result = firstOperand * secondOperand;
    } else if (operation === '/') {
      if (secondOperand === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = firstOperand / secondOperand;
    } else {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    // Save operation to history
    const newOperation = new Operation({
      firstOperand,
      secondOperand,
      operation,
      result
    });

    await newOperation.save();

    res.json({ result });
  } catch (error) {
    console.error('Error in calculate endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    const history = await Operation.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
