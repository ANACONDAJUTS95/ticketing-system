const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Ultrasound', 'Billing', 'Laboratory']
  },
  status: {
    type: String,
    required: true,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema); 