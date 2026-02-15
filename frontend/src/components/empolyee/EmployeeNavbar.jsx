import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const EmployeeNavbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">EMS Employee</span>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default EmployeeNavbar;
