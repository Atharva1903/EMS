import { useState, useEffect } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { applyLeave, getMyLeaves } from "../../services/leaveService";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [lastApplied, setLastApplied] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    leaveType: "Sick",
    fromDate: "",
    toDate: "",
    reason: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await getMyLeaves();
      setLeaves(res.data.leaves);
      setStats(res.data.stats);
      setLastApplied(res.data.lastApplied);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      alert("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await applyLeave(formData);
      alert("Leave applied successfully");
      setFormData({
        leaveType: "Sick",
        fromDate: "",
        toDate: "",
        reason: ""
      });
      fetchLeaves(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: { background: "#fef3c7", color: "#92400e" },
      Approved: { background: "#dcfce7", color: "#166534" },
      Rejected: { background: "#fee2e2", color: "#991b1b" }
    };
    return styles[status] || {};
  };

  return (
    <EmployeeLayout>
      <div style={container}>
        <h1>My Leaves</h1>

        {/* Stats Row */}
        <div style={statsGrid}>
          <div style={statCard}>
            <h3>Total Applied</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0", color: "#3b82f6" }}>{stats.total}</p>
          </div>
          <div style={statCard}>
            <h3>Pending</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0", color: "#f59e0b" }}>{stats.pending}</p>
          </div>
          <div style={statCard}>
            <h3>Approved</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0", color: "#10b981" }}>{stats.approved}</p>
          </div>
          <div style={statCard}>
            <h3>Rejected</h3>
            <p style={{ fontSize: "2rem", margin: "10px 0", color: "#ef4444" }}>{stats.rejected}</p>
          </div>
        </div>

        {/* Last Applied Leave */}
        {lastApplied && (
          <div style={{ ...card, marginTop: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>Last Applied Leave</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
              <div>
                <strong>Type:</strong> {lastApplied.leaveType}
              </div>
              <div>
                <strong>From:</strong> {new Date(lastApplied.fromDate).toLocaleDateString()}
              </div>
              <div>
                <strong>To:</strong> {new Date(lastApplied.toDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong> {lastApplied.status}
              </div>
            </div>
          </div>
        )}

        {/* Apply Leave Form */}
        <div style={{ ...card, marginTop: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>Apply for Leave</h2>
          <form onSubmit={handleSubmit} style={formGrid}>
            <div style={formGroup}>
              <label>Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Paid">Paid Leave</option>
                <option value="Personal">Personal Leave</option>
              </select>
            </div>

            <div style={formGroup}>
              <label>From Date</label>
              <Input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
              />
            </div>

            <div style={formGroup}>
              <label>To Date</label>
              <Input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
              />
            </div>

            <div style={{ ...formGroup, gridColumn: "span 3" }}>
              <label>Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                style={textAreaStyle}
                placeholder="Explain your reason for leave..."
              />
            </div>

            <div style={{ gridColumn: "span 3", marginTop: "10px" }}>
              <Button variant="success" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Leave Request"}
              </Button>
            </div>
          </form>
        </div>

        {/* Leave History */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ marginBottom: "16px" }}>Leave History</h2>
          {loading ? (
            <Loader />
          ) : (
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <Table headers={["Type", "From", "To", "Reason", "Status", "Applied On"]}>
                {leaves.length > 0 ? leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span style={{ ...statusBadge, ...getStatusStyle(leave.status) }}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      No leave applications yet
                    </td>
                  </tr>
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
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" };
const statCard = { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: "center" };
const card = { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const formGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" };
const formGroup = { display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#64748b" };
const selectStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white" };
const textAreaStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "80px", fontFamily: "inherit", resize: "vertical" };
const statusBadge = { padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "500", display: "inline-block" };

export default Leaves;
