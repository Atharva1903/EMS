const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      required={required}
      onChange={onChange}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        width: "100%"
      }}
    />
  );
};

export default Input;
