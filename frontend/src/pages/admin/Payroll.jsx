import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";


import {
  getPayrolls,
  createPayroll,
  runBulkPayroll,
  updatePayrollStatus,
  deletePayroll,
  deleteAllPayrolls
} from "../../services/payrollService";
import employeeService from "../../services/employeeService";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [bulkMonth, setBulkMonth] = useState("");
  const [bulkYear, setBulkYear] = useState("");
  const [runningBulk, setRunningBulk] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    bonus: 0,
    deductions: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const payrollRes = await getPayrolls();
      const employeeRes = await employeeService.getEmployees();

      setPayrolls(payrollRes.data);
      setEmployees(employeeRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      await createPayroll({
        ...formData,
        month: Number(formData.month),
        year: Number(formData.year),
        basicSalary: Number(formData.basicSalary),
        bonus: Number(formData.bonus),
        deductions: Number(formData.deductions)
      });

      setIsOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate payroll");
    }
  };

  const handleBulkRun = async () => {
    if (!bulkMonth || !bulkYear) {
      alert("Select month and year");
      return;
    }
    setRunningBulk(true);
    try {
      await runBulkPayroll({
        month: Number(bulkMonth),
        year: Number(bulkYear)
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to run bulk payroll");
    } finally {
      setRunningBulk(false);
    }
  };

  const handlePay = async (id) => {
    try {
      await updatePayrollStatus(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      try {
        await deletePayroll(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete payroll");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL payroll records? This action cannot be undone.")) {
      try {
        await deleteAllPayrolls();
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete all payrolls");
      }
    }
  };

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" }
  ];

  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Payroll Management</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Process salaries with automatic calculations and attendance-based deductions
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={bulkMonth}
              onChange={(e) => setBulkMonth(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={bulkYear}
              onChange={(e) => setBulkYear(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <Button variant="success" onClick={handleBulkRun} disabled={runningBulk}>
            {runningBulk ? "Running..." : "Run Payroll For All"}
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Generate Single
          </Button>
          <Button variant="danger" onClick={handleDeleteAll}>
            Clear All
          </Button>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && (
        <Table
          headers={[
            "Employee",
            "Month",
            "Year",
            "Base",
            "HRA",
            "Bonus",
            "Gross",
            "Deductions",
            "LOP",
            "Net Salary",
            "Status"
          ]}
        >
          {payrolls.map((pay) => (
            <tr key={pay._id}>
              <td>{pay.employeeId?.fullName}</td>
              <td>{months.find(m => m.value === pay.month)?.label || pay.month}</td>
              <td>{pay.year}</td>
              <td>{pay.basicSalary}</td>
              <td>{pay.hra}</td>
              <td>{pay.bonus}</td>
              <td>{pay.grossSalary}</td>
              <td>{pay.deductions}</td>
              <td>{pay.lopAmount}</td>
              <td>{pay.netSalary}</td>
              <td style={{ display: "flex", gap: "8px" }}>
                {pay.paymentStatus === "Pending" ? (
                  <Button variant="warning" onClick={() => handlePay(pay._id)}>
                    Pay
                  </Button>
                ) : (
                  <span style={{ color: "green", fontWeight: "bold", marginRight: "10px" }}>Paid</span>
                )}
                <Button variant="danger" onClick={() => handleDelete(pay._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3>Generate Payroll</h3>

        <select
          onChange={(e) =>
            setFormData({ ...formData, employeeId: e.target.value })
          }
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp.userId._id}>
              {emp.userId.fullName}
            </option>
          ))}
        </select>

        <select
          value={formData.month}
          onChange={(e) =>
            setFormData({ ...formData, month: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={formData.year}
          onChange={(e) =>
            setFormData({ ...formData, year: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <Input
          placeholder="Basic Salary"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, basicSalary: e.target.value })
          }
        />

        <Input
          placeholder="Bonus"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, bonus: e.target.value })
          }
        />

        <Input
          placeholder="Deductions"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, deductions: e.target.value })
          }
        />

        <Button variant="success" onClick={handleGenerate}>
          Generate
        </Button>
      </Modal>
    </AdminLayout>
  );
};

export default Payroll;
