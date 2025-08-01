import { useState } from "react";
import CalendarModal from "./CalendarModal";
import "./PatientDashboard.css";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [showPopup, setShowPopup] = useState("");
  const [complaint, setComplaint] = useState("");
  const loggedInPatientId = localStorage.getItem('patientId');
  const loggedInPatientName = localStorage.getItem('patientName');

  async function handleCalendarSubmit(dateObj) {
  // Format dateObj (assumes leading zeroes)
  const day = String(dateObj.day).padStart(2, '0');
  const month = String(dateObj.month).padStart(2, '0');
  const year = dateObj.year;
  const selectedDate = `${year}-${month}-${day}`; // "YYYY-MM-DD"

  try {
    const res = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patientId: loggedInPatientId,
        patientName: loggedInPatientName,
        date: selectedDate,
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setShowPopup(data.error || "Unable to book appointment");
      setTimeout(() => setShowPopup(""), 2500);
      setShowCalendar(false);
      return;
    }
    setShowPopup(`Appointment is fixed on ${selectedDate} at ${data.appointmentTime}!`);
    setShowCalendar(false);
    setTimeout(() => setShowPopup(""), 2500);
  } catch {
    setShowPopup("Network error. Please try again.");
    setTimeout(() => setShowPopup(""), 2500);
    setShowCalendar(false);
  }
}


  // Async complaint submit handler (send complaint to backend)
  async function handleComplaintSubmit(e) {
    e.preventDefault();
    if (!complaint.trim()) {
      setShowPopup("Please enter a complaint.");
      setTimeout(() => setShowPopup(""), 2000);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: complaint,
          patientId: loggedInPatientId // include patientId if your backend expects it
        })
      });

      if (!res.ok) throw new Error("Failed to submit complaint");

      const data = await res.json();
      setShowPopup(`Complaint submitted! ID: ${data._id || "N/A"}`);
      setShowComplaint(false);
      setComplaint("");
      setTimeout(() => setShowPopup(""), 2500);
    } catch (err) {
      setShowPopup("Error submitting complaint. Try again.");
      setTimeout(() => setShowPopup(""), 2000);
    }
  }

  // Async appointment booking handler with backend integration and limit checks
  async function handleBookAppointment() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patientId: loggedInPatientId, 
          patientName: loggedInPatientName,
          date: today,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Unable to book appointment");
        return;
      }
      alert(`Appointment booked at ${data.appointmentTime}`);
      // Optionally refresh appointments or show confirmation UI here
    } catch (err) {
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <span className="logout-link" onClick={() => navigate("/")}>
          Logout
        </span>
        <h2>Patient Dashboard</h2>

        <button className="btn action-btn" onClick={() => setShowComplaint(true)}>
          Raise Complaint
        </button>

        

        <button className="btn action-btn" onClick={() => setShowCalendar(true)}>
  Book Appointment
</button>

      </div>

      {/* Complaint Modal */}
      {showComplaint && (
        <div className="modal-overlay">
          <form className="modal-box" onSubmit={handleComplaintSubmit}>
            <h3>Submit your complaint</h3>
            <textarea
              rows="5"
              placeholder="Type your complaint here…"
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              required
            />
            <button type="submit" className="btn submit-btn">Submit</button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => setShowComplaint(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
  <CalendarModal
    onSubmit={handleCalendarSubmit}
    onClose={() => setShowCalendar(false)}
  />
)}


      {/* Popup */}
      {showPopup && (
        <div className="popup">
          {showPopup}
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
