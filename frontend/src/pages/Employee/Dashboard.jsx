import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Loader from "../../components/common/Loader";
import { getMyPayroll } from "../../services/payrollService";
import { getMyLeaves } from "../../services/leaveService";
import { getMyAttendance } from "../../services/attendanceService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    latestSalary: 0,
    totalEarnings: 0,
    attendanceThisMonth: 0,
    totalLeaves: 0,
    pendingLeaves: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    attendance: [],
    leaves: [],
    payroll: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Fetch all data in parallel
      const [payrollRes, leavesRes, attendanceRes] = await Promise.all([
        getMyPayroll(),
        getMyLeaves(),
        getMyAttendance(currentMonth, currentYear)
      ]);

      const payrolls = payrollRes.data || [];
      const leaves = leavesRes.data.leaves || [];
      const attendance = attendanceRes.data || [];

      // Calculate stats
      const totalEarnings = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
      const latestPayroll = [...payrolls].sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      })[0];

      const pendingLeaves = leaves.filter(l => l.status === "Pending").length;

      setStats({
        latestSalary: latestPayroll?.netSalary || 0,
        totalEarnings,
        attendanceThisMonth: attendance.filter(a => a.status === "Present").length,
        totalLeaves: leaves.length,
        pendingLeaves
      });

      // Set recent activity
      setRecentActivity({
        attendance: attendance.slice(0, 3),
        leaves: leaves.slice(0, 3),
        payroll: latestPayroll
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN') || 0}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (loading) {
    return (
      <EmployeeLayout>
        <Loader />
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div style={container}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ marginBottom: "8px" }}>Welcome Back!</h1>
          <p style={{ color: "#64748b", fontSize: "1.05rem" }}>Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div style={statsGrid}>
          <div style={{ ...statCard, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <div style={statIcon}>💰</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Latest Salary</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{formatCurrency(stats.latestSalary)}</p>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
            <div style={statIcon}>📊</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Total Earnings</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{formatCurrency(stats.totalEarnings)}</p>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <div style={statIcon}>✅</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Attendance (This Month)</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{stats.attendanceThisMonth} Days</p>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "white" }}>
            <div style={statIcon}>🏖️</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Leave Status</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>
              {stats.pendingLeaves} Pending
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
          <div style={quickActionsGrid}>
            <Link to="/employee/attendance" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📅</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Mark Attendance</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Record your presence for today</p>
            </Link>

            <Link to="/employee/leaves" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✈️</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Apply Leave</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Request time off</p>
            </Link>

            <Link to="/employee/payroll" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💳</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>View Payroll</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Check salary history</p>
            </Link>

            <Link to="/employee/profile" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👤</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>My Profile</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Update your information</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Recent Activity</h2>
          <div style={activityGrid}>
            {/* Recent Attendance */}
            <div style={activityCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📊</span> Recent Attendance
              </h3>
              {recentActivity.attendance.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recentActivity.attendance.map((att, idx) => (
                    <div key={idx} style={activityItem}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "500" }}>{formatDate(att.date)}</span>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.85rem",
                          background: "#dcfce7",
                          color: "#166534"
                        }}>
                          {att.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No attendance records yet</p>
              )}
            </div>

            {/* Recent Leaves */}
            <div style={activityCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🏖️</span> Recent Leaves
              </h3>
              {recentActivity.leaves.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recentActivity.leaves.map((leave, idx) => (
                    <div key={idx} style={activityItem}>
                      <div style={{ marginBottom: "4px" }}>
                        <span style={{ fontWeight: "500" }}>{leave.leaveType}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b" }}>
                        <span>{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}</span>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: leave.status === "Approved" ? "#dcfce7" : leave.status === "Pending" ? "#fef3c7" : "#fee2e2",
                          color: leave.status === "Approved" ? "#166534" : leave.status === "Pending" ? "#92400e" : "#991b1b"
                        }}>
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No leave applications yet</p>
              )}
            </div>

            {/* Latest Payroll */}
            <div style={activityCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>💰</span> Latest Payroll
              </h3>
              {recentActivity.payroll ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={activityItem}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "500" }}>
                        {monthNames[recentActivity.payroll.month - 1]} {recentActivity.payroll.year}
                      </span>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        background: recentActivity.payroll.paymentStatus === "Paid" ? "#dcfce7" : "#fef3c7",
                        color: recentActivity.payroll.paymentStatus === "Paid" ? "#166534" : "#92400e"
                      }}>
                        {recentActivity.payroll.paymentStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#059669" }}>
                      {formatCurrency(recentActivity.payroll.netSalary)}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "8px" }}>
                      Base: {formatCurrency(recentActivity.payroll.basicSalary)} |
                      HRA: {formatCurrency(recentActivity.payroll.hra)} |
                      Bonus: {formatCurrency(recentActivity.payroll.bonus)}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No payroll records yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

/* --- STYLES --- */
const container = { paddingBottom: "40px" };
const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};
const statCard = {
  padding: "28px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden"
};
const statIcon = {
  fontSize: "2rem",
  opacity: 0.9
};
const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
};
const actionCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
  textDecoration: "none",
  transition: "transform 0.2s, box-shadow 0.2s",
  border: "1px solid #e2e8f0",
  cursor: "pointer",
  display: "block"
};
const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px"
};
const activityCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0"
};
const activityItem = {
  padding: "12px",
  background: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0"
};

export default Dashboard;
