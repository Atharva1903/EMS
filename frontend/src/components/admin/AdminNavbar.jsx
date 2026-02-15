import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">EMS Admin</span>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
