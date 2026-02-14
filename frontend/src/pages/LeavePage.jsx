import { useState } from "react";
import API from "../services/api";

const LeavePage = () => {
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/leave/apply", form);
    alert("Leave Applied");
  };

  return (
    <div>
      <h2>Apply Leave</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Leave Type"
          onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setForm({ ...form, toDate: e.target.value })}
        />
        <textarea
          placeholder="Reason"
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default LeavePage;
