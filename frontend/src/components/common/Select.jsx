const Select = ({ options = [], value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        width: "100%"
      }}
    >
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
