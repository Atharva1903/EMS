import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getAllAttendance } from "../../services/attendanceService";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAttendance();
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1>Employee Attendance</h1>
      {loading && <Loader />}
      {!loading && (
        <Table headers={["Employee", "Email", "Date", "Status"]}>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.employeeId?.fullName}</td>
              <td>{rec.employeeId?.email}</td>
              <td>{new Date(rec.date).toLocaleDateString()}</td>
              <td>{rec.status}</td>
            </tr>
          ))}
        </Table>
      )}
    </AdminLayout>
  );
};

export default Attendance;
