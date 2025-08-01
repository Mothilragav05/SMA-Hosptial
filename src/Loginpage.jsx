import { useNavigate } from "react-router-dom";
import teethLogo from './assets/dentist-logo.png';
import logo from './assets/your-logo.png';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="page-background">
        <div className="company-header">
        <img
          src={logo}
          alt="Company Logo"
          className="company-logo"
        />
        <span className="company-name">SMA Hospital</span>
      </div>
      <div className="login-container">
      <img src={teethLogo} alt="Teeth Logo" className="teeth-logo" />
        <button className="btn doctor-btn" onClick={() => navigate("/doctor-login")}>
          Doctor Login
        </button><br></br>
        <button className="btn patient-btn" onClick={() => navigate("/patient-login")}>Patient Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
