import { Route, Routes } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";
import DoctorLoginPage from "./DoctorLoginPage";
import LoginPage from "./Loginpage";
import PatientDashboard from "./PatientDashboard";
import PatientLoginPage from "./patientlogin";
import ReportBox from "./ReportBox";
function App() {
  return(
  //  <PatientLoginPage/>
  <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/patient-login" element={<PatientLoginPage />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/doctor-login" element={<DoctorLoginPage />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/report-box" element={<ReportBox />} />
    </Routes>
  );
}

export default App;