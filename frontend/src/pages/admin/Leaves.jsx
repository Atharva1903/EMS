import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { getAllLeaves, updateLeaveStatus } from "../../services/leaveService";

const Leaves = () => {
  const fetchLeaves = async () => {
    const res = await getAllLeaves();
    setLeaves(res.data);
  };

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatus = async (id, status) => {
    await updateLeaveStatus(id, { status });
    fetchLeaves();
  };

  return (
    <AdminLayout>
      <h1>Leave Approvals</h1>

      <Table headers={["Employee", "Type", "From", "To", "Status", "Action"]}>
        {leaves.map(leave => (
          <tr key={leave._id}>
            <td>{leave.employeeId?.fullName}</td>
            <td>{leave.leaveType}</td>
            <td>{leave.fromDate}</td>
            <td>{leave.toDate}</td>
            <td>{leave.status}</td>
            <td>
              <Button onClick={() => handleStatus(leave._id, "Approved")}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => handleStatus(leave._id, "Rejected")}>
                Reject
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </AdminLayout>
  );
};

export default Leaves;
