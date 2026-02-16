import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={navbarStyle}>
      <div style={logoStyle}>EMS Admin</div>

      <div style={profileWrapper} ref={dropdownRef}>
        <div style={profileBox} onClick={() => setOpen(!open)}>
          <div style={avatarStyle}>
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span style={usernameStyle}>
            {user?.name || "Admin"}
          </span>
          <span style={arrowStyle}>{open ? "▲" : "▼"}</span>
        </div>

        {open && (
          <div style={dropdownStyle}>
            <div style={dropdownItem}>
              👤 {user?.email || "admin@example.com"}
            </div>
            <div style={divider}></div>
            <div
              style={logoutItem}
              onClick={logout}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const navbarStyle = {
  height: "70px",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const logoStyle = {
  fontSize: "1.3rem",
  fontWeight: "700",
  letterSpacing: "1px"
};

const profileWrapper = {
  position: "relative"
};

const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  padding: "8px 14px",
  borderRadius: "12px",
  transition: "0.3s ease",
};

const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#3b82f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
  fontSize: "1rem"
};

const usernameStyle = {
  fontWeight: "500"
};

const arrowStyle = {
  fontSize: "0.7rem"
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "55px",
  background: "white",
  color: "#1e293b",
  borderRadius: "14px",
  width: "220px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  overflow: "hidden",
  animation: "fadeIn 0.2s ease"
};

const dropdownItem = {
  padding: "14px 18px",
  fontSize: "0.9rem"
};

const logoutItem = {
  padding: "14px 18px",
  fontSize: "0.9rem",
  cursor: "pointer",
  color: "#ef4444",
  fontWeight: "500"
};

const divider = {
  height: "1px",
  background: "#e2e8f0"
};

export default AdminNavbar;
