import { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState("admin"); // "admin" or "employee"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      const role = localStorage.getItem("role");

      // Verify Role Match
      if (role !== activeRole) {
        setError(`Access Denied: You are not authorized as ${activeRole === "admin" ? "Admin" : "Employee"}.`);
        localStorage.clear(); // Clear session if role mismatch
        return;
      }

      if (role === "admin") navigate("/admin");
      else navigate("/employee");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const isAdmin = activeRole === "admin";

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>

        {/* Header Section */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            EMS Portal
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Please select your role to continue
          </p>
        </div>

        {/* Role Selector Toggle */}
        <div style={toggleContainer}>
          <button
            type="button"
            style={isAdmin ? activeToggleStyle : inactiveToggleStyle}
            onClick={() => { setActiveRole("admin"); setError(null); }}
          >
            Admin Login
          </button>
          <button
            type="button"
            style={!isAdmin ? activeToggleStyle : inactiveToggleStyle}
            onClick={() => { setActiveRole("employee"); setError(null); }}
          >
            Employee Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>

          {error && (
            <div style={errorBanner}>
              {error}
            </div>
          )}

          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={inputStyle}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={inputStyle}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: isAdmin ? "linear-gradient(135deg, #1e293b, #0f172a)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: isAdmin ? "0 4px 12px rgba(15, 23, 42, 0.2)" : "0 4px 12px rgba(37, 99, 235, 0.2)"
            }}
          >
            {isAdmin ? "Login as Admin" : "Login as Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* --- STYLES --- */
const wrapperStyle = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f1f5f9, #cbd5e1)",
  fontFamily: "'Inter', sans-serif"
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
};

const toggleContainer = {
  display: "flex",
  background: "#f1f5f9",
  padding: "4px",
  borderRadius: "12px",
  marginBottom: "30px"
};

const baseToggleStyle = {
  flex: 1,
  padding: "10px",
  fontSize: "0.9rem",
  fontWeight: "600",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const activeToggleStyle = {
  ...baseToggleStyle,
  background: "white",
  color: "#0f172a",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const inactiveToggleStyle = {
  ...baseToggleStyle,
  background: "transparent",
  color: "#64748b"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "#334155"
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "1rem",
  outline: "none",
  transition: "border 0.2s"
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
  transition: "transform 0.1s"
};

const errorBanner = {
  background: "#fef2f2",
  color: "#ef4444",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "0.9rem",
  textAlign: "center",
  border: "1px solid #fecaca"
};

export default Login;
