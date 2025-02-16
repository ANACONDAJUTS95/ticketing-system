const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets for a department
router.get('/:department', async (req, res) => {
  const { department } = req.params;
  console.log('Request received for department:', department);
  
  try {
    // Map URL parameter to actual department name
    let departmentName;
    switch(department.toLowerCase()) {
      case 'ultrasound':
        departmentName = 'UltrasoundQueue';
        break;
      case 'laboratory':
        departmentName = 'LaboratoryQueue';
        break;
      case 'billing':
        departmentName = 'BillingQueue';
        break;
      default:
        departmentName = department;
    }
    
    console.log('Searching for department:', departmentName);
    
    const tickets = await Ticket.find({ 
      department: departmentName,
      status: { $in: ['waiting', 'serving'] }
    }).sort('timestamp');
    
    console.log('Found tickets:', tickets);
    return res.json(tickets);
  } catch (err) {
    console.error('Queue fetch error:', err);
    return res.status(500).json({ 
      message: 'Failed to fetch queue data',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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