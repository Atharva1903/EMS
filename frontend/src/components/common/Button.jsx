const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false
}) => {
  const baseStyle = {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500"
  };

  const variants = {
    primary: { background: "#2563eb", color: "white" },
    danger: { background: "#dc2626", color: "white" },
    success: { background: "#16a34a", color: "white" },
    secondary: { background: "#6b7280", color: "white" }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

export default Button;
