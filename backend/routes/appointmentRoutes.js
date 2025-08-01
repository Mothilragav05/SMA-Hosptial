const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Time slots fixed on the backend for 5 appointments per day
const TIME_SLOTS = ["13:00", "13:30", "14:00", "14:30", "15:00"];

// POST - Book an appointment
router.post('/', async (req, res) => {
  const { patientId, patientName, date } = req.body;

  if (!patientId || !patientName || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find appointments already booked on that date
    const bookedAppointments = await Appointment.find({ date });
    
    // If already 5 appointments booked return error
    if (bookedAppointments.length >= TIME_SLOTS.length) {
      return res.status(400).json({ error: 'No appointments available for the selected date' });
    }

    // Find next available time slot
    const bookedTimes = bookedAppointments.map(a => a.appointmentTime);
    const nextAvailableTime = TIME_SLOTS.find(time => !bookedTimes.includes(time));

    if (!nextAvailableTime) {
      return res.status(400).json({ error: 'No appointment times available' });
    }

    // Create the appointment and save
    const appointment = new Appointment({
      patientId,
      patientName,
      date,
      appointmentTime: nextAvailableTime,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - fetch appointments filtered by date (optional query ?date=YYYY-MM-DD)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter).sort({ appointmentTime: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

module.exports = router;
