const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  date: { type: String, required: true },  // "YYYY-MM-DD"
  appointmentTime: { type: String, required: true }, // e.g., "13:00"
  status: { type: String, default: 'Booked' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
