import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import {
  getEmployeeCount,
  getLeaveStats,
  getPayrollStats
} from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    payrolls: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const empRes = await getEmployeeCount();
        const leaveRes = await getLeaveStats();
        const payrollRes = await getPayrollStats();

        setStats({
          employees: empRes.data.totalEmployees,
          totalLeaves: leaveRes.data.totalLeaves,
          pendingLeaves: leaveRes.data.pendingLeaves,
          payrolls: payrollRes.data.totalPayrolls
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>

      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={grid}>
          <Card>
            <h3>Total Employees</h3>
            <p>{stats.employees}</p>
          </Card>

          <Card>
            <h3>Total Leaves</h3>
            <p>{stats.totalLeaves}</p>
          </Card>

          <Card>
            <h3>Pending Leaves</h3>
            <p>{stats.pendingLeaves}</p>
          </Card>

          <Card>
            <h3>Payroll Records</h3>
            <p>{stats.payrolls}</p>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

export default Dashboard;
