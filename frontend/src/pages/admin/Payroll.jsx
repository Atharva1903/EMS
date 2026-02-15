import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

import { getPayrolls, createPayroll } from "../../services/payrollService";
import { getEmployees } from "../../services/employeeService";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
      const employeeRes = await getEmployees();

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

  return (
    <AdminLayout>
      <h1>Payroll Management</h1>

      <Button onClick={() => setIsOpen(true)}>Generate Payroll</Button>

      {loading && <Loader />}

      {!loading && (
        <Table
          headers={[
            "Employee",
            "Month",
            "Year",
            "Basic",
            "Bonus",
            "Deductions",
            "Net Salary",
            "Status"
          ]}
        >
          {payrolls.map(pay => (
            <tr key={pay._id}>
              <td>{pay.employeeId?.fullName}</td>
              <td>{pay.month}</td>
              <td>{pay.year}</td>
              <td>{pay.basicSalary}</td>
              <td>{pay.bonus}</td>
              <td>{pay.deductions}</td>
              <td>{pay.netSalary}</td>
              <td>{pay.paymentStatus}</td>
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

        <Input
          placeholder="Month"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, month: e.target.value })
          }
        />

        <Input
          placeholder="Year"
          type="number"
          onChange={(e) =>
            setFormData({ ...formData, year: e.target.value })
          }
        />

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
