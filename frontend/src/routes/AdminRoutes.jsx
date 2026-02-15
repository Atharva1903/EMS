import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Employees from "../pages/admin/Employees";
import Departments from "../pages/admin/Departments";
import Leaves from "../pages/admin/Leaves";
import Payroll from "../pages/admin/Payroll";
import Attendance from "../pages/admin/Attendance";
import Reports from "../pages/admin/Reports";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="employees" element={<Employees />} />
      <Route path="departments" element={<Departments />} />
      <Route path="leaves" element={<Leaves />} />
      <Route path="payroll" element={<Payroll />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
};

export default AdminRoutes;
