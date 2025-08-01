import { useState } from "react";
import "./CalendarModal.css";

// Helper: Array of weekday headings (start Sun or Mon as needed)
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getDaysArray(year, month) {
  // month is 0-based
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // In JS, 0=Sunday, 1=Monday...
  // We'll display with Monday as first column
  let startWeekDay = firstDay.getDay(); // 0(Sun) .. 6(Sat)
  startWeekDay = startWeekDay === 0 ? 6 : startWeekDay - 1; // Convert to 0=Mon,6=Sun

  const days = [];
  // Empty slots for days before the 1st
  for (let i = 0; i < startWeekDay; i++) days.push(null);
  // Then all days of the month
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export default function CalendarModal({ onSubmit, onClose }) {
  // Start at today
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [selected, setSelected] = useState(null);

  const days = getDaysArray(year, month);

  function prevMonth() {
    setSelected(null); // Optionally clear selection when switching months
    setMonth(m => (m === 0 ? 11 : m - 1));
    if (month === 0) setYear(y => y - 1);
  }
  function nextMonth() {
    setSelected(null);
    setMonth(m => (m === 11 ? 0 : m + 1));
    if (month === 11) setYear(y => y + 1);
  }

  function handleSubmit() {
    if (selected) {
      // Pass selected date as {year, month, day}
      onSubmit && onSubmit({ year, month: month + 1, day: selected }); // month+1 for human-readable
    }
    onClose && onClose();
  }

  return (
    <div className="calendar-modal-overlay">
      <div className="calendar-modal-box">
        <div className="calendar-header-row">
          <button className="arrow-btn" onClick={prevMonth}>&lt;</button>
          <span className="calendar-title-row">
            {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button className="arrow-btn" onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {WEEKDAYS.map(wd =>
            <div className="calendar-header-cell" key={wd}>{wd}</div>
          )}
          {days.map((d, idx) =>
            <div
              key={idx}
              className={`calendar-cell${d === selected ? " selected" : ""}${d == null ? " empty" : ""}`}
              onClick={() => d && setSelected(d)}
            >
              {d}
            </div>
          )}
        </div>
        <button
          className="btn submit-btn"
          disabled={!selected}
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="btn cancel-btn"
          style={{ marginTop: "8px" }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
