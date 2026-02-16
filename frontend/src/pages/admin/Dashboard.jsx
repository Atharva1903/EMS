import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

import {
  getEmployeeCount,
  getLeaveStats,
  getPayrollStats,
  getAttendanceStats
} from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: { total: 0, active: 0, interns: 0, fullTime: 0, newJoinees: 0, departmentWise: [] },
    leaves: { total: 0, pending: 0, rejected: 0, onLeave: 0, breakdown: [] },
    payroll: { total: 0, paid: 0, pending: 0, paidCount: 0, pendingCount: 0, expense: 0 },
    attendance: { present: 0, absent: 0, percentage: 0, totalActive: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const monthIndex = months.indexOf(selectedMonth) + 1;

        const [empRes, leaveRes, payrollRes, attRes] = await Promise.all([
          getEmployeeCount(),
          getLeaveStats(),
          getPayrollStats(monthIndex, selectedYear),
          getAttendanceStats()
        ]);

        setStats({
          employees: {
            total: empRes.data.totalEmployees,
            active: empRes.data.activeEmployees,
            interns: empRes.data.interns,
            fullTime: empRes.data.fullTime,
            newJoinees: empRes.data.newJoinees,
            departmentWise: empRes.data.departmentWise
          },
          leaves: {
            total: leaveRes.data.totalLeaves,
            pending: leaveRes.data.pendingLeaves,
            rejected: leaveRes.data.rejectedLeaves,
            onLeave: leaveRes.data.employeesOnLeave
          },
          payroll: {
            total: payrollRes.data.totalPayrolls,
            paid: payrollRes.data.totalPaid,
            pending: payrollRes.data.totalPending,
            paidCount: payrollRes.data.paidCount,
            pendingCount: payrollRes.data.pendingCount,
            expense: payrollRes.data.totalSalaryExpense
          },
          attendance: {
            present: attRes.data.presentToday,
            absent: attRes.data.absentToday,
            percentage: attRes.data.attendancePercentage,
            totalActive: attRes.data.totalActive
          }
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth, selectedYear]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const empTypeData = [
    { name: "Full Time", value: stats.employees.fullTime },
    { name: "Interns", value: stats.employees.interns }
  ];

  const payrollData = [
    { name: "Paid", value: stats.payroll.paid },
    { name: "Pending", value: stats.payroll.pending }
  ];

  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN') || 0}`;

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ color: "#ef4444", padding: "20px" }}>{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ marginBottom: "8px" }}>Admin Dashboard</h1>
          <p style={{ color: "#64748b", fontSize: "1.05rem" }}>Overview of your organization's key metrics</p>
        </div>

        {/* Main Stats Grid */}
        <div style={statsGrid}>
          <div style={{ ...statCard, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <div style={statIcon}>👥</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Total Employees</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{stats.employees.total}</p>
            <div style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.9 }}>
              {stats.employees.active} Active • {stats.employees.newJoinees} New
            </div>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
            <div style={statIcon}>📊</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Attendance Today</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{stats.attendance.present}</p>
            <div style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.9 }}>
              {stats.attendance.percentage}% • {stats.attendance.absent} Absent
            </div>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <div style={statIcon}>🏖️</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Leave Requests</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{stats.leaves.pending}</p>
            <div style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.9 }}>
              Pending • {stats.leaves.onLeave} On Leave Today
            </div>
          </div>

          <div style={{ ...statCard, background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "white" }}>
            <div style={statIcon}>💰</div>
            <h3 style={{ margin: "12px 0 8px 0", fontSize: "0.95rem", opacity: 0.9 }}>Payroll Expense</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>{formatCurrency(stats.payroll.expense)}</p>
            <div style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.9 }}>
              {stats.payroll.paidCount} Paid • {stats.payroll.pendingCount} Pending
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
          <div style={quickActionsGrid}>
            <Link to="/admin/employees" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👥</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Manage Employees</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Add, edit, or remove employees</p>
            </Link>

            <Link to="/admin/attendance" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📅</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>View Attendance</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Track employee attendance</p>
            </Link>

            <Link to="/admin/leaves" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✈️</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Approve Leaves</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Review leave requests</p>
            </Link>

            <Link to="/admin/payroll" style={actionCard}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💳</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Run Payroll</h3>
              <p style={{ margin: "0", color: "#64748b", fontSize: "0.9rem" }}>Generate salary records</p>
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Analytics</h2>
          <div style={chartsGrid}>
            {/* Employee Type Chart */}
            <div style={chartCard}>
              <h3 style={{ marginBottom: "20px" }}>Employee Type Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={empTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {empTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Department Wise Chart */}
            <div style={chartCard}>
              <h3 style={{ marginBottom: "20px" }}>Department Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.employees.departmentWise}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payroll Chart */}
            <div style={chartCard}>
              <h3 style={{ marginBottom: "20px" }}>Payroll Status ({selectedMonth} {selectedYear})</h3>
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={selectStyle}
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={selectStyle}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Detailed Overview</h2>
          <div style={summaryGrid}>
            <div style={summaryCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>👥</span> Employee Breakdown
              </h3>
              <div style={summaryItem}>
                <span>Full Time Employees</span>
                <strong>{stats.employees.fullTime}</strong>
              </div>
              <div style={summaryItem}>
                <span>Interns</span>
                <strong>{stats.employees.interns}</strong>
              </div>
              <div style={summaryItem}>
                <span>New Joinees (This Month)</span>
                <strong>{stats.employees.newJoinees}</strong>
              </div>
            </div>

            <div style={summaryCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🏖️</span> Leave Summary
              </h3>
              <div style={summaryItem}>
                <span>Total Leave Requests</span>
                <strong>{stats.leaves.total}</strong>
              </div>
              <div style={summaryItem}>
                <span>Pending Approval</span>
                <strong style={{ color: "#f59e0b" }}>{stats.leaves.pending}</strong>
              </div>
              <div style={summaryItem}>
                <span>On Leave Today</span>
                <strong style={{ color: "#3b82f6" }}>{stats.leaves.onLeave}</strong>
              </div>
            </div>

            <div style={summaryCard}>
              <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>💰</span> Payroll Summary
              </h3>
              <div style={summaryItem}>
                <span>Total Expense</span>
                <strong>{formatCurrency(stats.payroll.expense)}</strong>
              </div>
              <div style={summaryItem}>
                <span>Paid Amount</span>
                <strong style={{ color: "#10b981" }}>{formatCurrency(stats.payroll.paid)}</strong>
              </div>
              <div style={summaryItem}>
                <span>Pending Amount</span>
                <strong style={{ color: "#f59e0b" }}>{formatCurrency(stats.payroll.pending)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
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
const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px"
};
const chartCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0"
};
const selectStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "white",
  fontSize: "0.9rem",
  cursor: "pointer"
};
const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px"
};
const summaryCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0"
};
const summaryItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  background: "#f8fafc",
  borderRadius: "8px",
  marginBottom: "8px",
  border: "1px solid #e2e8f0"
};

export default Dashboard;
