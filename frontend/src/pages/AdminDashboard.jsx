import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const empRes = await api.get("/api/employees/stats/count");
        const leaveRes = await api.get("/api/leaves/stats");

        setStats({
          totalEmployees: empRes.data.totalEmployees,
          totalLeaves: leaveRes.data.totalLeaves,
          pendingLeaves: leaveRes.data.pendingLeaves
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const numberStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <div style={cardStyle}>
          <h3>Total Employees</h3>
          <p style={numberStyle}>{stats.totalEmployees}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Leaves</h3>
          <p style={numberStyle}>{stats.totalLeaves}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Leaves</h3>
          <p style={numberStyle}>{stats.pendingLeaves}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
