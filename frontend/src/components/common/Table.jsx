const Table = ({ headers = [], children }) => {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={cellStyle}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px"
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left"
};

export default Table;
