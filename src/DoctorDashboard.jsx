import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import photo from './assets/WhatsApp Image 2025-07-29 at 17.02.55_4168325b.jpg';
import "./DoctorDashboard.css";

function getTodayDate() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}
function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5); // "HH:mm"
}


function getNextPatientId(patients) {
  const existingIds = new Set(
    patients
      .filter(p => p.patientId) // in case some patients lack patientId yet
      .map(p => parseInt(p.patientId, 10))
  );
  let nextNum = 1;
  while (existingIds.has(nextNum)) nextNum++;
  return nextNum.toString().padStart(6, '0');
}


export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard"); // "dashboard" or "patients"
  const [patients, setPatients] = useState([]); // Empty initial patient list
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [appointments, setAppointments] = useState([]);
  // Inside your DoctorDashboard component, before return JSX:

const currentDateStr = getTodayDate(); // Renamed variable

// Filter appointments based on renamed variable
const todaysAppointments = appointments.filter(appt =>
  appt.date === currentDateStr &&
  ["Booked", "Waiting", "Appointment", "In Consultation"].includes(appt.status) &&
  appt.appointmentTime >= getCurrentTime()
);

const upcomingAppointments = appointments.filter(appt =>
  appt.date > currentDateStr && appt.status !== "Completed"
);

  // Form state for new patient, default date/time initialized on modal open
  const [newPatient, setNewPatient] = useState({
    name: "",
    gender: "",
    age: "",
    problem: "",
    date: getTodayDate(),
    registerTime: getCurrentTime(),
    status: "Waiting",
  });


  // Logout handler
  const handleLogoutClick = (e) => {
    e.preventDefault();
    navigate("/");
  };


  // Reset & open Add Patient modal with current date/time defaults
  const openAddPatientModal = () => {
    setNewPatient({
      name: "",
      gender: "",
      age: "",
      problem: "",
      date: getTodayDate(),
      registerTime: getCurrentTime(),
      status: "Waiting",
    });
    setShowAddPatient(true);
  };
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light';
});
  

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch('http://localhost:5000/api/patients');
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error loading patients", error);
        setPatients([]);
      }
    }
    fetchPatients();
  }, []);


  useEffect(() => {
  localStorage.setItem('theme', theme);
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
}, [theme]);
  useEffect(() => {
  async function fetchAppointments() {
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`http://localhost:5000/api/appointments?date=${today}`);
      if (!res.ok) throw new Error('Failed to load appointments');
      const data = await res.json();
      setAppointments(data);
    } catch {
      setAppointments([]);
    }
  }
  fetchAppointments();
}, []);
  const handleAddPatient = async (e) => {
  e.preventDefault();


  if (
    !newPatient.name ||
    !newPatient.gender ||
    !newPatient.age ||
    !newPatient.problem ||
    !newPatient.date
  ) {
    alert("Please fill all the required fields.");
    return;
  }


  // Generate patientId as before
  const newPatientId = getNextPatientId(patients);


  const patientWithId = {
    ...newPatient,
    patientId: newPatientId,
  };


  try {
    const response = await fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientWithId),
    });


    if (!response.ok) {
      const errData = await response.json();
      alert(errData.error || "Failed to add patient");
      return;
    }


    const savedPatient = await response.json();


    // Update frontend state to show new patient
    setPatients([...patients, savedPatient]);


    // Reset and close modal
    setNewPatient({
      name: "",
      gender: "",
      age: "",
      problem: "",
      date: getTodayDate(),
      registerTime: getCurrentTime(),
      status: "Waiting",
    });
    setShowAddPatient(false);


  } catch (error) {
    alert("Error adding patient: " + error.message);
  }
};



const handleDeletePatient = async (index) => {
  if (!window.confirm("Are you sure you want to delete this patient?")) return;
  const patientToDelete = patients[index];
  try {
    const res = await fetch(`http://localhost:5000/api/patients/${patientToDelete.patientId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete patient');
    setPatients(patients.filter((_, i) => i !== index));
  } catch (error) {
    alert('Error deleting patient: ' + error.message);
  }
};


  const todayStr = getTodayDate();
  const todaysAptsCount = patients.filter(p => p.date === todayStr).length;
  const pendingTasksCount = patients.filter(
  (p) => p.date === todayStr && p.status === "Waiting"
).length;
  const stats = [
    { label: "Total Patients", value: patients.length, color: "#2563eb" },
    { label: "Today’s Apts", value: todaysAptsCount, color: "#22c55e" },
    // { label: "Lab Reports", value: fixedStats.labReports, color: "#c026d3" },
    { label: "Pending Tasks", value: pendingTasksCount, color: "#eab308" },
  ];
  useEffect(() => {
  if (activeSection === "report-box") {
    setLoadingComplaints(true);
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(() => setComplaints([]))
      .finally(() => setLoadingComplaints(false));
  }
}, [activeSection]);


  return (
    <div className={`doc-dashboard-bg ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="doc-sidebar">
        <div className="sidebar-logo">SMA Hospital</div>
        <nav className="sidebar-nav">
          <a
            href="#"
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("dashboard");
            }}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={activeSection === "patients" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("patients");
            }}
          >
            Patients
          </a>
         <a
  href="#"
  className={activeSection === "appointments" ? "active" : ""}
  onClick={(e) => {
    e.preventDefault();
    setActiveSection("appointments");
  }}
>
  Appointments
</a>


          {/* <a href="#">Lab Results</a> */}
 <a
  href="#"
  className={activeSection === 'settings' ? 'active' : ''}
  onClick={e => {
    e.preventDefault();
    setActiveSection('settings');
  }}
>
  Settings
</a>



          <a
  href="#"
  className={activeSection === "report-box" ? "active" : ""}
  onClick={(e) => {
    e.preventDefault();
    setActiveSection("report-box");
  }}
>
  Report Box
</a>


          <a href="#" onClick={handleLogoutClick}>
            Logout
          </a>
        </nav>
      </aside>


      {/* Main Content */}
      <div className="doc-main">
        {activeSection === "dashboard" && (
          <>
            {/* Top bar */}
            <header className="doc-header">
              <span>Welcome, Dr. Suba</span>
              <img src={photo} alt="Doctor" className="doc-avatar" />
            </header>


            {/* Overview Cards */}
            <section className="doc-stats-row">
              {stats.map((s) => (
                <div
                  className="doc-stat-card"
                  style={{ borderColor: s.color }}
                  key={s.label}
                >
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </section>


            {/* Patient List & Appointments */}
            <section className="doc-sections-row">
              <div className="doc-card medium">
                <h3>Recent Patients</h3>
                {patients.length === 0 ? (
                  <p>No patients to show</p>
                ) : (
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p, i) => (
                        <tr key={i}>
                          <td>{p.name}</td>
                          <td>{p.gender}</td>
                          <td>{p.age}</td>
                          <td>
                            <span
                              className={`status-badge ${p.status
                                .replace(/\s/g, "")
                                .toLowerCase()}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="doc-card small">
                <h3>Today’s Appointments</h3>
                {patients.length === 0 ? (
                  <p>No appointments to show</p>
                ) : (
                  <ul className="doc-appt-list">
  {patients
    .filter(
      (p) =>
        p.date === getTodayDate() &&
        ["Waiting", "In Consultation","Appointment"].includes(p.status)
    )
    .map((a) => (
      <li key={a.name}>
        <span>{a.registerTime || "-"} - {a.name}</span>
        <span
          className={`status-dot ${a.status.replace(/\s/g, "").toLowerCase()}`}
        ></span>
      </li>
    ))}
</ul>


                )}
              </div>
            </section>
          </>
        )}


        {activeSection === "patients" && (
          <div
            style={{
              padding: "24px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(37,99,235,0.07)",
              minHeight: "80vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2>Patient List</h2>
              <button
                className="btn action-btn"
                onClick={openAddPatientModal}
              >
                + Add New Patient
              </button>
            </div>
            {patients.length === 0 ? (
              <p>No patients added yet.</p>
            ) : (
              <table className="doc-table" style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Problem</th>
                    <th>Date</th>
                    <th>Register Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr key={p.patientId || i}>
                      <td>{p.patientId || '—'}</td>
                      <td>{p.name}</td>
                      <td>{p.gender}</td>
                      <td>{p.age}</td>
                      <td>{p.problem || "-"}</td>
                      <td>{p.date || "-"}</td>
                      <td>{p.registerTime || "-"}</td>
          
      <td>
        <select
          value={p.status}
          onChange={async (e) => {
            const newStatus = e.target.value;
            try {
              const res = await fetch(`http://localhost:5000/api/patients/${p.patientId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
              });
              if (!res.ok) throw new Error('Failed to update status');
              const updatedPatient = await res.json();
              const updatedPatients = [...patients];
              updatedPatients[i] = updatedPatient;
              setPatients(updatedPatients);
            } catch (error) {
              alert('Error updating status: ' + error.message);
            }
          }}
          style={{ padding: 4, borderRadius: 6 }}
        >
          {[
            "Waiting",
            "In Consultation",
            "Upcoming",
            "Completed",
            "Appointment",
          ].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </td>
      <button
          className="btn cancel-btn"
          style={{ padding: "6px 12px", fontSize: "0.9rem" }}
          onClick={() => handleDeletePatient(i)}
        >
          Delete
        </button>
      {/* Other actions like delete button */}
    </tr>
  ))}
</tbody>


              </table>
            )}


            {showAddPatient && (
              <div
                className="modal-overlay"
                onClick={() => setShowAddPatient(false)}
              >
                <form
                  className="patient-modal-box"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={handleAddPatient}
                  autoComplete="off"
                >
                  <div className="modal-title-row">
                    <span className="modal-title">Add New Patient</span>
                    <button
                      type="button"
                      className="icon-close-btn"
                      aria-label="Close"
                      onClick={() => setShowAddPatient(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="input-row">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={newPatient.name}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-row">
                    <label>Gender</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, gender: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div className="input-row">
                    <label>Age</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Enter Age"
                      value={newPatient.age}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, age: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-row">
                    <label>Problem</label>
                    <input
                      type="text"
                      placeholder="Describe Problem"
                      value={newPatient.problem}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, problem: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-row">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newPatient.date}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-row">
                    <label>Register Time</label>
                    <input
                      type="time"
                      value={newPatient.registerTime}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, registerTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-row">
                    <label>Status</label>
                    <select
                      value={newPatient.status}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, status: e.target.value })
                      }
                    >
                      <option value="Waiting">Waiting</option>
                      <option value="In Consultation">In Consultation</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Appointment">Appointment</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="btn submit-btn">
                      Add Patient
                    </button>
                    <button
                      type="button"
                      className="btn cancel-btn"
                      onClick={() => setShowAddPatient(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        {activeSection === "appointments" && (
  <div
  className={`appointments-section ${theme === "dark" ? "dark" : "light"}`}
    style={{
      padding: "24px",
      // backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(37,99,235,0.07)",
      minHeight: "80vh",
      overflowY: "auto",
      backgroundColor: theme === "dark" ? "#232a35" : "#fff",
    }}
  >
    <h2>Appointments</h2>


    {(() => {
      const todayStr = getTodayDate();
      const currentTime = getCurrentTime();


      // Filter Today's Appointments: date is today, status waiting/in consultation, and time after now
      const todaysAppointments = patients.filter(
        (p) =>
          p.date === todayStr &&
          ["Waiting", "In Consultation","Appointment"].includes(p.status) &&
          p.registerTime &&
          p.registerTime > currentTime
      );


      // Filter Upcoming Appointments: date after today, status not completed
      const upcomingAppointments = patients.filter(
        (p) => p.date > todayStr && p.status !== "Completed"
      );


      return (
        <>
          <section style={{ marginBottom: 24 }}>
            <h3>Today's Appointments</h3>
{appointments.length === 0 ? (
  <p>No appointments for today</p>
) : (
  <table className="doc-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Patient Name</th>
        <th>Patient ID</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {appointments.map(appt => (
        <tr key={appt._id}>
           <td>{appt.date}</td>
          <td>{appt.appointmentTime}</td>
          <td>{appt.patientName}</td>
          <td>{appt.patientId}</td>
          <td>{appt.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


          </section>


          <section>
            <h3>Upcoming Appointments</h3>
            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <table className="doc-table" style={{ marginTop: 8 }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appt, idx) => (
                    <tr key={idx}>
                      <td>{appt.date}</td>
                      <td>{appt.name}</td>
                      <td>
                        <span
                          className={`status-badge ${appt.status
                            .replace(/\s+/g, "")
                            .toLowerCase()}`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      );
    })()}
  </div>
)}
{activeSection === "report-box" && (
  <div
    className="doc-card"
    style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 16px rgba(37,99,235,0.10)",
      padding: 32,
    }}
  >
    <h2>Report Box / Complaints</h2>
    {loadingComplaints ? (
      <p>Loading...</p>
    ) : complaints.length === 0 ? (
      <p>No complaints found.</p>
    ) : (
      <table className="doc-table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "34%" }}>ID</th>
            <th>Message</th>
            <th style={{ width: "28%" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td style={{ fontSize: "0.93em" }}>{c._id}</td>
              <td>{c.message}</td>
              <td style={{ fontSize: "0.95em" }}>
                {new Date(c.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}
{activeSection === 'settings' && (
  <>
    <h2>Settings</h2>
    <div style={{ marginTop: 24 }}>
      <label htmlFor="theme-select" style={{ fontWeight: 600, marginRight: 10 }}>
        Select Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{
          padding: 6,
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          cursor: 'pointer',
          backgroundColor: theme === 'dark' ? '#232a35' : '#fff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          minWidth: 120,
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  </>
)}



      </div>
    </div>
  );
}