import { useEffect, useState } from "react";
import api from "../services/api";

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveType, setLeaveType] = useState("Sick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const role = localStorage.getItem("role");

  // Fetch leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const endpoint =
          role === "admin" ? "/api/leaves" : "/api/leaves";

        const res = await api.get(endpoint);
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
  }, [role]);

  // Apply leave (Employee)
  const handleApply = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/leaves", {
        leaveType,
        fromDate,
        toDate,
        reason
      });

      setLeaves((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin approve/reject
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/leaves/${id}`, { status });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? res.data : leave
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leave Management</h2>

      {/* Employee Apply Form */}
      {role === "employee" && (
        <form onSubmit={handleApply} style={{ marginBottom: "20px" }}>
          <select onChange={(e) => setLeaveType(e.target.value)}>
            <option>Sick</option>
            <option>Casual</option>
            <option>Paid</option>
          </select>

          <input
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            onChange={(e) => setToDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Reason"
            onChange={(e) => setReason(e.target.value)}
          />

          <button type="submit">Apply Leave</button>
        </form>
      )}

      {/* Leave Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {role === "admin" && <th>Employee</th>}
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            {role === "admin" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              {role === "admin" && (
                <td>{leave.employeeId?.fullName}</td>
              )}
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td>{new Date(leave.toDate).toLocaleDateString()}</td>
              <td>{leave.status}</td>

              {role === "admin" && (
                <td>
                  <button
                    onClick={() =>
                      handleStatusChange(leave._id, "Approved")
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(leave._id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
};

export default LeavePage;
