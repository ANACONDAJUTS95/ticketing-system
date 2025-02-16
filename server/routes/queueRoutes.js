const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets for a department
router.get('/:department', async (req, res) => {
  try {
    const { department } = req.params;
    console.log(`Accessing ${department} department queue`);
    
    // Convert department name to match exactly
    const departmentName = department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();
    
    const tickets = await Ticket.find({ 
      department: departmentName,
      status: { $in: ['waiting', 'serving'] }
    }).sort('timestamp');
    
    console.log(`Found ${tickets.length} tickets for ${departmentName}`);
    return res.json(tickets);
  } catch (err) {
    console.error('Queue fetch error:', err);
    return res.status(500).json({ 
      message: 'Failed to fetch queue data',
      error: err.message 
    });
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