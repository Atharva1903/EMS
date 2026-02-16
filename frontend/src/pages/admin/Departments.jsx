import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { FaTrashAlt, FaPlus, FaBuilding } from 'react-icons/fa'; // Added icons

import {
  getDepartments,
  createDepartment,
  deleteDepartment
} from "../../services/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!name) return alert("Department name required");
      await createDepartment({ name });
      setIsOpen(false);
      setName("");
      fetchDepartments();
    } catch {
      alert("Failed to create");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch {
      alert("Failed to delete department");
    }
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaBuilding style={{ fontSize: '28px', color: '#3b82f6' }} /> Departments
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "4px" }}>
            Organize your organization structure and teams
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
          className="d-inline-flex align-items-center"
        >
          <FaPlus style={{ marginRight: '8px' }} /> Add Department
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card shadow-sm">
          <Table headers={["Department Name", "Action"]}style={{backgroundColor:"#f8f9fa"}}>
            {departments.map(dep => (
              <tr key={dep._id}>
                <td style={{ fontWeight: "500", color: "#000000ff" }}>
                  {dep.name}
                </td>
                <td style={{ width: "150px" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(dep._id)}
                    className="d-inline-flex align-items-center"
                    title="Delete Department"
                  >
                    <FaTrashAlt style={{ marginRight: '6px' }} /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
          
          {departments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No departments found. Click "Add Department" to start.
            </div>
          )}
        </div>
      )}

      {/* Modernized Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: "10px" }}>
          <h3 style={{ marginBottom: "20px" }}>Create New Department</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '14px' }}>
              Department Name
            </label>
            <Input
              placeholder="e.g. Engineering, Human Resources..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleCreate}>
              Save Department
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Departments;
