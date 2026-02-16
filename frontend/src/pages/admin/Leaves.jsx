import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { getAllLeaves, updateLeaveStatus } from "../../services/leaveService";
import employeeService from "../../services/employeeService";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    const res = await getAllLeaves();
    setLeaves(res.data);
  };

  const fetchEmployees = async () => {
    const data = await employeeService.getEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchLeaves(), fetchEmployees()]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatus = async (id, status) => {
    await updateLeaveStatus(id, { status });
    fetchLeaves();
  };

  const salaryByUserId = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      if (emp.userId?._id) {
        map[emp.userId._id] = emp.salary || 0;
      }
    });
    return map;
  }, [employees]);

  const getLeaveDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diff =
      Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const getEstimatedDeduction = (leave) => {
    const userId = leave.employeeId?._id;
    const salary = salaryByUserId[userId] || 0;
    if (!salary) return 0;

    const days = getLeaveDays(leave.fromDate, leave.toDate);
    const dailyRate = salary / 30;

    let factor = 0;
    if (leave.leaveType === "Paid") factor = 0;
    else if (leave.leaveType === "Sick") factor = 0.5;
    else factor = 1; // Casual or Personal

    const amount = dailyRate * days * factor;
    return Math.round(amount);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");

  const onLeaveToday = leaves.filter((leave) => {
    if (leave.status !== "Approved") return false;
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    return today >= from && today <= to;
  });

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Leave Management</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Review pending leave requests and monitor employees currently on leave
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "12px" }}>Pending Requests</h3>
            <Table headers={["Employee", "Type", "From", "To", "Status", "Est. Deduction", "Action"]}>
              {pendingLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employeeId?.fullName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.fromDate)}</td>
                  <td>{formatDate(leave.toDate)}</td>
                  <td>{leave.status}</td>
                  <td>
                    ₹{getEstimatedDeduction(leave)}
                  </td>
                  <td>
                    <Button onClick={() => handleStatus(leave._id, "Approved")}>
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleStatus(leave._id, "Rejected")}
                      style={{ marginLeft: "8px" }}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
              {pendingLeaves.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "8px" }}>
                    No pending leave requests
                  </td>
                </tr>
              )}
            </Table>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "12px" }}>Employees on Leave Today</h3>
            <Table headers={["Employee", "Type", "From", "To", "Est. Deduction"]}>
              {onLeaveToday.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employeeId?.fullName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.fromDate)}</td>
                  <td>{formatDate(leave.toDate)}</td>
                  <td>₹{getEstimatedDeduction(leave)}</td>
                </tr>
              ))}
              {onLeaveToday.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "8px" }}>
                    No employees on leave today
                  </td>
                </tr>
              )}
            </Table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Leaves;
