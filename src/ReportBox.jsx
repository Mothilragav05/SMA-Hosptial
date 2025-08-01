// ReportBox.jsx
import React, { useEffect, useState } from "react";

export default function ReportBox() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (e) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  return (
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 16px rgba(37,99,235,0.10)",
      padding: 32
    }}>
      <h2>Report Box / Complaints</h2>
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "36%" }}>ID</th>
              <th>Message</th>
              <th style={{ width: "28%" }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td style={{ fontSize: "0.9em" }}>{c._id}</td>
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
  );
}
