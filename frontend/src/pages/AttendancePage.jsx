import { useState } from "react";
import API from "../services/api";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState({
    checkIn: "",
    checkOut: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/attendance/mark", attendance);
      alert("Attendance Marked Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>

      <form onSubmit={handleSubmit}>
        <label>Check In:</label>
        <input
          type="time"
          onChange={(e) =>
            setAttendance({ ...attendance, checkIn: e.target.value })
          }
        />

        <label>Check Out:</label>
        <input
          type="time"
          onChange={(e) =>
            setAttendance({ ...attendance, checkOut: e.target.value })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AttendancePage;
