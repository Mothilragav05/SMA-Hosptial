require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Connect to MongoDB with connection URI from environment variable
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// API Routes

// GET /api/complaints - fetch all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/complaints - add a new complaint
app.post('/api/complaints', async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Complaint message is required' });
  }
  try {
    const complaint = new Complaint({ message });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error saving complaint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
