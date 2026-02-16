import { useEffect, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { markToday, getMyAttendance } from "../../services/attendanceService";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Stats
  const [stats, setStats] = useState({ present: 0, absent: 0, percentage: 0 });

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMyAttendance(month, year);
      setRecords(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const presentCount = data.filter(r => r.status === "Present").length;
    // Absent logic: Rough estimate or based on "Absent" records if they exist. 
    // Since we only mark "Present" or "Leave", we can't fully know "Absent" without a daily job.
    // user requested "Monthly Report", so let's show Present Count.
    // If backend doesn't create "Absent" records automatically, we can only show "Present" days.

    // Using simple logic: Total Present.
    setStats({
      present: presentCount,
      percentage: data.length > 0 ? ((presentCount / 30) * 100).toFixed(1) : 0 // illustrative %
    });
  };

  const handleMarkToday = async () => {
    setSubmitting(true);
    try {
      await markToday();
      alert("Attendance marked for today!");
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if today is marked
  const isTodayMarked = records.some(rec => {
    const recDate = new Date(rec.date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return recDate === today;
  });

  return (
    <EmployeeLayout>
      <div style={container}>
        <h1>My Attendance</h1>

        {/* 1. Mark Attendance Card */}
        <div style={heroCard}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", margin: "0 0 10px 0", color: "#1e293b" }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p style={{ color: "#64748b", margin: 0 }}>{new Date().toDateString()}</p>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {isTodayMarked ? (
              <div style={successBadge}>
                ✅ You are marked Present for today
              </div>
            ) : (
              <Button
                onClick={handleMarkToday}
                disabled={submitting}
                style={{ padding: "12px 32px", fontSize: "1.1rem", background: "#3b82f6" }}
              >
                {submitting ? "Marking..." : "Mark Present"}
              </Button>
            )}
          </div>
        </div>

        {/* 2. Monthly Report Section */}
        <div style={{ marginTop: "40px" }}>
          <div style={headerRow}>
            <h2>Monthly Report</h2>
            <div style={filterGroup}>
              <select value={month} onChange={(e) => setMonth(e.target.value)} style={select}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)} style={select}>
                {Array.from({ length: 5 }, (_, i) => 2024 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Row */}
          <div style={statsGrid}>
            <div style={statCard}>
              <h3>Total Present</h3>
              <p style={{ color: "green" }}>{stats.present} Days</p>
            </div>
            {/* 
                  Note: "Absent" and "%" are harder to calculate accurately without a schedule.
                  Showing "Present" provides immediate value. 
                */}
          </div>

          {loading ? <Loader /> : (
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden", marginTop: "20px" }}>
              <Table headers={["Date", "Status", "Time In"]}>
                {records.length > 0 ? records.map((rec) => (
                  <tr key={rec._id}>
                    <td>{new Date(rec.date).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem",
                        background: rec.status === "Present" ? "#dcfce7" : "#fee2e2",
                        color: rec.status === "Present" ? "#166534" : "#991b1b"
                      }}>
                        {rec.status}
                      </span>
                    </td>
                    <td>{new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>No attendance records found for this month</td></tr>
                )}
              </Table>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

/* --- STYLES --- */
const container = { paddingBottom: "40px" };
const heroCard = {
  background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  border: "1px solid #cbd5e1",
  maxWidth: "500px",
  margin: "0 auto"
};
const successBadge = {
  background: "#dcfce7", color: "#166534", padding: "12px 24px", borderRadius: "50px",
  fontWeight: "600", display: "inline-block"
};
const headerRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" };
const filterGroup = { display: "flex", gap: "10px" };
const select = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" };
const statCard = { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", texAlign: "center" };

export default Attendance;
