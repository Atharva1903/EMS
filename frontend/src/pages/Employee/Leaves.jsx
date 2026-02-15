import { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { applyLeave } from "../../services/leaveService";

const Leaves = () => {
  const [formData, setFormData] = useState({
    leaveType: "Sick",
    fromDate: "",
    toDate: "",
    reason: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      alert("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await applyLeave(formData);
      alert("Leave applied successfully");
      setFormData({
        leaveType: "Sick",
        fromDate: "",
        toDate: "",
        reason: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <h1>Apply Leave</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Leave Type
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
            <option value="Paid">Paid</option>
          </select>
        </label>

        <label>
          From Date
          <Input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
          />
        </label>

        <label>
          To Date
          <Input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Reason
          <Input
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
        </label>

        <Button variant="success" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </EmployeeLayout>
  );
};

export default Leaves;
