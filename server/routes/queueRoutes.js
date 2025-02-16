const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets for a department
router.get('/:department', async (req, res) => {
  try {
    console.log('Fetching tickets for department:', req.params.department);
    const tickets = await Ticket.find({ 
      department: req.params.department,
      status: { $in: ['waiting', 'serving'] }
    }).sort('timestamp');
    console.log('Found tickets:', tickets);
    res.json(tickets);
  } catch (err) {
    console.error('Queue fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Generate new ticket
router.post('/generate', async (req, res) => {
  try {
    const { department, prefix } = req.body;
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const code = `${prefix}-${randomNumber}`;

    const ticket = new Ticket({
      code,
      department,
      status: 'waiting'
    });

    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 