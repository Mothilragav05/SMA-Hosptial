import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorLoginPage.css";
import ForgotPassword from "./ForgotPassword";
// import DoctorDashboard from "./DoctorDashboard";

function DoctorLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  const trimmedUserId = userId.trim();

  // Check both User ID and Password
  const isUserIdCorrect = trimmedUserId === "suba07";
  const isPasswordCorrect = password === "doctor123";

  if (!isUserIdCorrect && !isPasswordCorrect) {
    setError("User ID and Password are incorrect.");
    setShowForgot(false); // Don't show forgot password if both are wrong
    return;
  }

  if (!isUserIdCorrect) {
    setError("Incorrect User ID. Please enter the correct User ID.");
    setShowForgot(false);
    return;
  }

  if (!isPasswordCorrect) {
    setError("Incorrect password.");
    setShowForgot(true);
    return;
  }

  // Both correct
  setError("");
  setShowForgot(false);
  navigate("/doctor-dashboard");  // Add this line
  return;
  // Proceed as needed, e.g., navigate to doctor dashboard
};

  return (
    <div className="page-background">
      {/* Optional: include company branding */}
      <div className="login-container">
        <h2 className="login-title">Doctor Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="userId">Doctor User ID:</label>
          <input
            id="userId"
            type="text"
            placeholder="Enter your Doctor User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn doctor-btn">
            Login
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {showForgot && <ForgotPassword />}
        <div
          className="btn back-btn"
          style={{
            marginTop: "16px",
            color: "black",
            justifyContent: "center",
            marginRight: "-150px",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          Back to Login Page
        </div>
      </div>
    </div>
  );
}

export default DoctorLoginPage;
