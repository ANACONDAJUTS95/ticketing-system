const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get ticket status
router.get('/:code', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ code: req.params.code });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 