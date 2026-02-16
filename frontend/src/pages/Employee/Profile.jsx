import { useContext, useState, useEffect } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { AuthContext } from "../../context/auth-context";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { changePassword } from "../../services/authService";
import employeeService from "../../services/employeeService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ attendance: {}, leaves: {} });
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    dob: ""
  });

  // Password State
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await employeeService.fetchProfile();
      setProfile(res.data.employee);
      setStats(res.data.stats);
      setPayrollHistory(res.data.payrollHistory || []);

      setFormData({
        fullName: res.data.employee.userId.fullName,
        mobile: res.data.employee.mobile || "",
        address: res.data.employee.address || "",
        dob: res.data.employee.dob ? res.data.employee.dob.split('T')[0] : ""
      });

    } catch (err) {
      console.error(err);
      alert("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateProfile(formData);
      alert("Profile updated successfully!");
      setEditing(false);
      fetchProfileData(); // Refresh
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) return alert("Passwords do not match");

    setPassLoading(true);
    try {
      await changePassword(passData.old, passData.new);
      alert("Password updated");
      setPassData({ old: "", new: "", confirm: "" });
    } catch (err) {
      alert("Failed to change password");
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <EmployeeLayout>
      <div style={container}>
        {/* Header */}
        <div style={header}>
          <h1>My Profile</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)} style={{ background: "#3b82f6" }}>
              Edit Personal Details
            </Button>
          )}
        </div>

        {/* 1. Stats Row */}
        <div style={grid}>
          <div style={card}>
            <h3>Attendance (This Month)</h3>
            <div style={statRow}>
              <div style={{ ...statItem, color: "green" }}>
                <span>Present</span>
                <strong>{stats.attendance.present} Days</strong>
              </div>
              <div style={{ ...statItem, color: "red" }}>
                <span>Absent</span>
                <strong>{stats.attendance.absent} Days</strong>
              </div>
            </div>
          </div>

          <div style={card}>
            <h3>Leave Status</h3>
            <div style={statRow}>
              <div style={statItem}>
                <span>Pending</span>
                <strong>{stats.leaves.Pending || 0}</strong>
              </div>
              <div style={statItem}>
                <span>Approved</span>
                <strong>{stats.leaves.Approved || 0}</strong>
              </div>
              <div style={statItem}>
                <span>Rejected</span>
                <strong>{stats.leaves.Rejected || 0}</strong>
              </div>
            </div>
          </div>

          <div style={card}>
            <h3>Latest Salary</h3>
            {payrollHistory.length > 0 ? (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <h2 style={{ color: "#10b981", margin: 0 }}>${payrollHistory[0].netSalary}</h2>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {new Date(0, payrollHistory[0].month - 1).toLocaleString('default', { month: 'long' })} {payrollHistory[0].year}
                </span>
                <div style={{
                  marginTop: "5px",
                  padding: "4px 8px",
                  background: payrollHistory[0].paymentStatus === "Paid" ? "#dcfce7" : "#fee2e2",
                  color: payrollHistory[0].paymentStatus === "Paid" ? "#166534" : "#991b1b",
                  borderRadius: "4px",
                  display: "inline-block",
                  fontSize: "0.8rem"
                }}>
                  {payrollHistory[0].paymentStatus}
                </div>
              </div>
            ) : <p>No records found</p>}
          </div>
        </div>

        {/* 2. Details & Edit Form */}
        <div style={{ ...grid, marginTop: "24px", gridTemplateColumns: "2fr 1fr" }}>

          {/* Personal Details Form */}
          <div style={card}>
            <h3>Personal Information</h3>
            <form onSubmit={handleUpdateProfile} style={formGrid}>
              <div style={formGroup}>
                <label>Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div style={formGroup}>
                <label>Email (Read-Only)</label>
                <Input value={profile?.userId?.email} disabled />
              </div>
              <div style={formGroup}>
                <label>Mobile Number</label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  disabled={!editing}
                  placeholder="Add Mobile Number"
                />
              </div>
              <div style={formGroup}>
                <label>Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div style={{ ...formGroup, gridColumn: "span 2" }}>
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  style={textAreaStyle}
                  placeholder="Add Address"
                />
              </div>

              {editing && (
                <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
                  <Button type="submit" style={{ background: "#10b981" }}>Save Changes</Button>
                  <Button type="button" onClick={() => { setEditing(false); fetchProfileData(); }} style={{ background: "#ef4444" }}>Cancel</Button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password & Professional Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={card}>
              <h3>Professional Details</h3>
              <div style={infoRow}>
                <span>Department:</span> <strong>{profile?.department}</strong>
              </div>
              <div style={infoRow}>
                <span>Designation:</span> <strong>{profile?.designation}</strong>
              </div>
              <div style={infoRow}>
                <span>Employment Type:</span> <strong>{profile?.employmentType}</strong>
              </div>
              <div style={infoRow}>
                <span>Joining Date:</span> <strong>{new Date(profile?.joiningDate).toLocaleDateString()}</strong>
              </div>
            </div>

            <div style={card}>
              <h3>Security</h3>
              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Input
                  type="password" placeholder="Old Password"
                  value={passData.old} onChange={e => setPassData({ ...passData, old: e.target.value })}
                />
                <Input
                  type="password" placeholder="New Password"
                  value={passData.new} onChange={e => setPassData({ ...passData, new: e.target.value })}
                />
                <Input
                  type="password" placeholder="Confirm Password"
                  value={passData.confirm} onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                />
                <Button type="submit" disabled={passLoading}>{passLoading ? "Updating..." : "Update Password"}</Button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </EmployeeLayout>
  );
};

/* --- STYLES --- */
const container = { paddingBottom: "40px" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" };
const card = { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const statRow = { display: "flex", justifyContent: "space-between", marginTop: "16px" };
const statItem = { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
const formGroup = { display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#64748b" };
const textAreaStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", minHeight: "80px", fontFamily: "inherit" };
const infoRow = { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" };

export default Profile;
