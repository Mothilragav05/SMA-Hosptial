const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    name: String,
    gender: String,
    age: Number,
    problem: String,
    date: String,        // "YYYY-MM-DD"
    registerTime: String, // "HH:mm"
    status: String
});

module.exports = mongoose.model('Patient', PatientSchema);
