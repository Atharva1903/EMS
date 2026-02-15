import { useEffect, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { markToday, getMyAttendance } from "../../services/attendanceService";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getMyAttendance();
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkToday = async () => {
    setSubmitting(true);
    try {
      await markToday();
      await fetchData();
      alert("Attendance marked for today");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <h1>My Attendance</h1>
      <div style={{ margin: "16px 0" }}>
        <Button onClick={handleMarkToday} disabled={submitting}>
          {submitting ? "Marking..." : "Mark Present Today"}
        </Button>
      </div>
      {loading && <Loader />}
      {!loading && (
        <Table headers={["Date", "Status"]}>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{new Date(rec.date).toLocaleDateString()}</td>
              <td>{rec.status}</td>
            </tr>
          ))}
        </Table>
      )}
    </EmployeeLayout>
  );
};

export default Attendance;
