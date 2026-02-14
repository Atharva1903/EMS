import { useEffect, useState } from "react";
import api from "../services/api";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "admin") {
          const empRes = await api.get("/api/employees");
          setEmployees(empRes.data);

          const payrollRes = await api.get("/api/payroll");
          setPayrolls(payrollRes.data);
        } else {
          const payrollRes = await api.get("/api/payroll/my");
          setPayrolls(payrollRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [role]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/payroll", {
        employeeId,
        month: Number(month),
        year: Number(year),
        basicSalary: Number(basicSalary),
        bonus: Number(bonus),
        deductions: Number(deductions)
      });

      setPayrolls((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payroll Management</h2>

      {/* Admin Payroll Generator */}
      {role === "admin" && (
        <form onSubmit={handleGenerate} style={{ marginBottom: "20px" }}>
          <select onChange={(e) => setEmployeeId(e.target.value)} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.userId._id} value={emp.userId._id}>
                {emp.userId.fullName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Month"
            onChange={(e) => setMonth(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Basic Salary"
            onChange={(e) => setBasicSalary(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Bonus"
            onChange={(e) => setBonus(e.target.value)}
          />

          <input
            type="number"
            placeholder="Deductions"
            onChange={(e) => setDeductions(e.target.value)}
          />

          <button type="submit">Generate Payroll</button>
        </form>
      )}

      {/* Payroll Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {role === "admin" && <th>Employee</th>}
            <th>Month</th>
            <th>Year</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.map((pay) => (
            <tr key={pay._id}>
              {role === "admin" && (
                <td>{pay.employeeId?.fullName}</td>
              )}
              <td>{pay.month}</td>
              <td>{pay.year}</td>
              <td>{pay.basicSalary}</td>
              <td>{pay.bonus}</td>
              <td>{pay.deductions}</td>
              <td>{pay.netSalary}</td>
              <td>{pay.paymentStatus}</td>
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

export default PayrollPage;
