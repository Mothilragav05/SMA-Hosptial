const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// routes/patientRoutes.js
router.post('/login', async (req, res) => {
  const { patientId } = req.body;
  const patient = await Patient.findOne({ patientId });
  if (!patient) {
    return res.status(404).json({ error: "Invalid Patient ID" });
  }
  res.json({
    patientId: patient.patientId,
    name: patient.name,
    // ...other patient info as needed
  });
});

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ patientId: 1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get patients' });
    }
});

// Add new patient
router.post('/', async (req, res) => {
    try {
        const existingPatient = await Patient.findOne({ patientId: req.body.patientId });
        if(existingPatient) {
            return res.status(400).json({ error: 'Patient ID already exists' });
        }
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error saving patient' });
    }
});
// Delete patient by patientId (DELETE)
router.delete('/:patientId', async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({ patientId: req.params.patientId });
    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient' });
  }
});

// Update status by patientId (PATCH)
router.patch('/:patientId', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient status' });
  }
});


module.exports = router;
