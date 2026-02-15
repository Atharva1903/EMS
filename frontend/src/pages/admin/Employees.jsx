import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import api from "../../services/api";
import { updateUser } from "../../services/userService";
import {
  getEmployees,
  deleteEmployee,
  updateEmployee,
  createEmployee
} from "../../services/employeeService";

const Employees = () => {
  // --- State ---
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    salary: ""
  });

  // --- Actions ---
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      department: "",
      designation: "",
      salary: ""
    });
    setIsEdit(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateUser(selectedEmployee.userId._id, {
          fullName: formData.fullName,
          email: formData.email
        });

        await updateEmployee(selectedEmployee._id, {
          department: formData.department,
          designation: formData.designation,
          salary: Number(formData.salary)
        });
      } else {
        if (!formData.fullName || !formData.email || !formData.password) {
          alert("Name, email and password are required");
          return;
        }

        const registerRes = await api.post("/api/auth/register", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "employee"
        });

        const user = registerRes.data.user;

        await createEmployee({
          userId: user._id,
          department: formData.department,
          designation: formData.designation,
          salary: Number(formData.salary)
        });
      }

      setIsOpen(false);
      setIsEdit(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (emp) => {
    setIsEdit(true);
    setSelectedEmployee(emp);
    setFormData({
      fullName: emp.userId?.fullName || "",
      email: emp.userId?.email || "",
      department: emp.department || "",
      designation: emp.designation || "",
      salary: emp.salary || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Employees</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Manage employee accounts, roles and salary details
          </p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsOpen(true); }}>
          Add Employee
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card">
          <Table headers={["Name", "Email", "Department", "Designation", "Salary", "Actions"]}>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.userId?.fullName}</td>
                <td>{emp.userId?.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.salary}</td>
                <td>
                  <Button variant="secondary" onClick={() => handleEdit(emp)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(emp._id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); resetForm(); }}>
        <h3 style={{ marginBottom: "16px" }}>
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              disabled={isEdit}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <Input
              placeholder="Email"
              value={formData.email}
              disabled={isEdit}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {!isEdit && (
            <div>
              <Input
                type="password"
                placeholder="Temporary Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <Input
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div>
            <Input
              placeholder="Designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Employees;
