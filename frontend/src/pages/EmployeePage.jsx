import { useEffect, useState } from "react";
import api from "../services/api";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/api/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);
const handleDelete = async (id) => {
  try {
    await api.delete(`/api/employees/${id}`);

    // Remove deleted employee from state
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employees</h2>

      <table style={tableStyle}>
        <thead>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Designation</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Action</th>
  </tr>
</thead>

<tbody>
  {employees.map((emp) => (
    <tr key={emp._id}>
      <td>{emp.userId?.fullName}</td>
      <td>{emp.userId?.email}</td>
      <td>{emp.designation}</td>
      <td>{emp.department}</td>
      <td>{emp.salary}</td>
      <td>
        <button
          style={deleteBtnStyle}
          onClick={() => handleDelete(emp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
};
const deleteBtnStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

export default EmployeePage;
