import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientLoginPage.css";

function PatientLoginPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  // Restrict input to digits only onChange
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-digit chars
    setPatientId(value);
  };

  // Merged handleLogin function with validation and backend login API call
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    // Regex to check exactly 6 digits
    const sixDigitNumber = /^\d{6}$/;
    if (!sixDigitNumber.test(patientId)) {
      setMessage("Patient ID must be exactly 6 digits, no characters allowed.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid Patient ID");
        return;
      }
      
      const data = await res.json();
      // TODO: Store patient info or token here if needed
      // Navigate to patient dashboard after successful login
      localStorage.setItem('patientName', data.name);
      localStorage.setItem('patientId', data.patientId);
      navigate("/patient-dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="page-background">
      <div className="company-header">{/* Optional: logo/name */}</div>

      <div className="login-container">
        <h2 className="login-title">Patient Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="patientId">Patient ID:</label>
          <input
            id="patientId"
            type="text"
            placeholder="Enter your 6-digit Patient ID"
            value={patientId}
            onChange={handleChange}
            maxLength={6} // limit to 6 characters
            required
            autoFocus
          />
          <button type="submit" className="btn patient-btn">
            Login
          </button>
          {/* Error message display */}
          {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
        </form>

        {/* Validation message display */}
        {message && <div className="message" style={{ color: "red" }}>{message}</div>}

        <div
          className="btn back-btn"
          style={{ marginTop: "16px", color: "black", justifyContent: "center", marginRight: "-150px" }}
          onClick={() => navigate("/")}
        >
          Back to Login Page
        </div>
      </div>
    </div>
  );
}

export default PatientLoginPage;
