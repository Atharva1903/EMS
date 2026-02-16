import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">EMS Admin</h3>

      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/employees">Employees</Link>
      <Link to="/admin/departments">Departments</Link>
      <Link to="/admin/leaves">Leaves</Link>
      <Link to="/admin/payroll">Payroll</Link>
      <Link to="/admin/attendance">Attendance</Link>
    </div>
  );
};

export default AdminSidebar;
