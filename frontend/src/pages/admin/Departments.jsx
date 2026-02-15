import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete department?")) return;

    await deleteDepartment(id);
    fetchDepartments();
  };

  return (
    <AdminLayout>
      <h1>Departments</h1>

      <Button onClick={() => setIsOpen(true)}>
        Add Department
      </Button>

      {loading && <Loader />}

      {!loading && (
        <Table headers={["Department Name", "Action"]}>
          {departments.map(dep => (
            <tr key={dep._id}>
              <td>{dep.name}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(dep._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3>Add Department</h3>

        <Input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button variant="success" onClick={handleCreate}>
          Save
        </Button>
      </Modal>
    </AdminLayout>
  );
};

export default Departments;
