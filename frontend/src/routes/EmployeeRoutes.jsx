import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Employee/Dashboard";
import Profile from "../pages/Employee/Profile";
import Attendance from "../pages/Employee/Attendance";
import Leaves from "../pages/Employee/Leaves";
import Payroll from "../pages/Employee/Payroll";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="leave" element={<Leaves />} />
      <Route path="payroll" element={<Payroll />} />
    </Routes>
  );
};

export default EmployeeRoutes;
