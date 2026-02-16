import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import api from "../../services/api";
import { updateUser } from "../../services/userService";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import employeeService from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";

const Employees = () => {
  // --- State ---
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    salary: "",
    employmentType: "Full-time",
    status: "Active"
  });

  // --- Actions ---
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
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
      salary: "",
      employmentType: "Full-time",
      status: "Active"
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

        await employeeService.updateEmployee(selectedEmployee._id, {
          department: formData.department,
          designation: formData.designation,
          salary: Number(formData.salary),
          employmentType: formData.employmentType,
          status: formData.status
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

        await employeeService.createEmployee({
          userId: user._id,
          department: formData.department,
          designation: formData.designation,
          salary: Number(formData.salary),
          employmentType: formData.employmentType
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
      salary: emp.salary || "",
      employmentType: emp.employmentType || "Full-time",
      status: emp.status || "Active"
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  const fetchDepartmentsList = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartmentsList();
  }, []);

  const chipBaseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    padding: "2px 8px",
    borderRadius: "999px",
    marginLeft: "8px",
    borderWidth: "1px",
    borderStyle: "solid"
  };

  const getStatusChipStyle = (status) => {
    if (status === "On Leave") {
      return {
        ...chipBaseStyle,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#b91c1c",
        borderColor: "#fecaca"
      };
    }
    return {
      ...chipBaseStyle,
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "#166534",
      borderColor: "#bbf7d0"
    };
  };

  const interns = employees.filter(
    (emp) => (emp.employmentType || "Full-time") === "Intern"
  );
  const fullTimeEmployees = employees.filter(
    (emp) => (emp.employmentType || "Full-time") === "Full-time"
  );

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Employees</h1>
          <p style={{ color: "#ffffffff", marginTop: "4px" }}>
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
        <>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "12px" }}>Full-time Employees</h3>
            <Table headers={["Name", "Email", "Department", "Designation", "Salary", "Actions"]}>
              {fullTimeEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    {emp.userId?.fullName}
                    <span style={getStatusChipStyle(emp.status || "Active")}>
                      {emp.status || "Active"}
                    </span>
                  </td>
                  <td>{emp.userId?.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary}</td>
                  <td style={{ whiteSpace: 'nowrap', display: 'flex', gap: '8px' }}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(emp)}
                      title="Edit Employee"
                      className="d-inline-flex align-items-center"
                    >
                      <FaEdit style={{ marginRight: '6px' }} /> Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(emp._id)}
                      title="Delete Employee"
                      className="d-inline-flex align-items-center"
                    >
                      <FaTrashAlt style={{ marginRight: '6px' }} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "12px" }}>Interns</h3>
            <Table headers={["Name", "Email", "Department", "Designation", "Salary", "Actions"]}>
              {interns.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    {emp.userId?.fullName}
                    <span style={getStatusChipStyle(emp.status || "Active")}>
                      {emp.status || "Active"}
                    </span>
                  </td>
                  <td>{emp.userId?.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary}</td>
                  <td style={{ whiteSpace: 'nowrap', display: 'flex', gap: '8px' }}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(emp)}
                      title="Edit Employee"
                      className="d-inline-flex align-items-center"
                    >
                      <FaEdit style={{ marginRight: '6px' }} /> Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(emp._id)}
                      title="Delete Employee"
                      className="d-inline-flex align-items-center"
                    >
                      <FaTrashAlt style={{ marginRight: '6px' }} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </>
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
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5f5",
                backgroundColor: "rgba(15, 23, 42, 0.5)",
                color: "#e2e8f0"
              }}
            >
              <option value="">
                {departments.length ? "Select Department" : "No departments created"}
              </option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep.name}>
                  {dep.name}
                </option>
              ))}
            </select>
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

          <div>
            <select
              value={formData.employmentType}
              onChange={(e) =>
                setFormData({ ...formData, employmentType: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5f5",
                backgroundColor: "rgba(15, 23, 42, 0.5)",
                color: "#e2e8f0"
              }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {isEdit && (
            <div>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  backgroundColor: "rgba(15, 23, 42, 0.5)",
                  color: "#e2e8f0"
                }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          )}
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
