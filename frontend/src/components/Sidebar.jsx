import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">EMS</h2>

      <Link to="/admin">Dashboard</Link>
      <Link to="/employees">Employees</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/leave">Leave</Link>
      <Link to="/payroll">Payroll</Link>
    </div>
  );
};

export default Sidebar;
