import { Link } from "react-router-dom";

const EmployeeSidebar = () => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">EMS Employee</h3>

      <Link to="/employee/dashboard">Dashboard</Link>
      <Link to="/employee/profile">Profile</Link>
      <Link to="/employee/attendance">Attendance</Link>
      <Link to="/employee/leave">Leave</Link>
      <Link to="/employee/payroll">Payroll</Link>
    </div>
  );
};

export default EmployeeSidebar;
