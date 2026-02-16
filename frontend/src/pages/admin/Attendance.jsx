import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getAllAttendance } from "../../services/attendanceService";
import employeeService from "../../services/employeeService";
import { getAllLeaves } from "../../services/leaveService";
import Input from "../../components/common/Input";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" }
  ];

  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attendanceRes, employeesData, leavesRes] = await Promise.all([
          getAllAttendance(),
          employeeService.getEmployees(),
          getAllLeaves()
        ]);
        setRecords(attendanceRes.data);
        setEmployees(employeesData);
        setLeaves(leavesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const selectedMonth = Number(month);
  const selectedYear = Number(year);

  const monthStart = useMemo(
    () => new Date(selectedYear, selectedMonth - 1, 1),
    [selectedMonth, selectedYear]
  );
  const monthEnd = useMemo(
    () => new Date(selectedYear, selectedMonth, 1),
    [selectedMonth, selectedYear]
  );

  const daysInMonth =
    new Date(selectedYear, selectedMonth, 0).getDate();

  const attendanceByUser = useMemo(() => {
    const map = {};
    records.forEach((rec) => {
      const userId = rec.employeeId?._id;
      if (!userId) return;
      const date = new Date(rec.date);
      if (date < monthStart || date >= monthEnd) return;
      const key = String(userId);
      if (!map[key]) {
        map[key] = {
          present: 0
        };
      }
      if (rec.status === "Present") {
        map[key].present += 1;
      }
    });
    return map;
  }, [records, monthStart, monthEnd]);

  const leavesByUser = useMemo(() => {
    const map = {};
    leaves.forEach((leave) => {
      if (leave.status !== "Approved") return;
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      if (to < monthStart || from >= monthEnd) return;

      const userId = leave.employeeId?._id;
      if (!userId) return;
      const key = String(userId);
      if (!map[key]) map[key] = 0;

      const start = from < monthStart ? monthStart : from;
      const end = to >= monthEnd ? new Date(monthEnd.getTime() - 1) : to;
      const days =
        Math.round(
          (end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
        ) + 1;
      map[key] += days > 0 ? days : 0;
    });
    return map;
  }, [leaves, monthStart, monthEnd]);

  const rows = useMemo(() => {
    const list = [];
    employees.forEach((emp) => {
      const userId = emp.userId?._id;
      if (!userId) return;
      const key = String(userId);
      const att = attendanceByUser[key] || { present: 0 };
      const leaveDays = leavesByUser[key] || 0;
      const presentDays = att.present;
      const totalDays = daysInMonth;

      // Logic for Absent Days:
      // If month is past: Total - Present - Leave
      // If month is future: 0
      // If month is current: DaysPassed (until yesterday) - Present - Leave

      const today = new Date();
      let daysPassed = 0;

      if (selectedYear < today.getFullYear() || (selectedYear === today.getFullYear() && selectedMonth < today.getMonth() + 1)) {
        // Past month
        daysPassed = totalDays;
      } else if (selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1) {
        // Current month
        // Only count days that have fully passed (i.e., yesterday)
        daysPassed = today.getDate() - 1;
        if (daysPassed < 0) daysPassed = 0;
      } else {
        // Future month
        daysPassed = 0;
      }

      let absentDays = daysPassed - presentDays - leaveDays;
      if (absentDays < 0) absentDays = 0;

      list.push({
        id: key,
        name: emp.userId.fullName,
        email: emp.userId.email,
        department: emp.department,
        status: emp.status || "Active",
        presentDays: presentDays,
        leaveDays: leaveDays,
        absentDays: absentDays
      });
    });
    return list;
  }, [employees, attendanceByUser, leavesByUser, daysInMonth]);

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Monthly Attendance</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Track per-employee attendance and leaves for a selected month
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader />}
      {!loading && (
        <div className="card">
          <Table
            headers={[
              "Employee",
              "Email",
              "Department",
              "Status",
              "Present Days",
              "Leave Days",
              "Absent Days"
            ]}
          >
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.name}
                  <span style={getStatusChipStyle(row.status)}>
                    {row.status}
                  </span>
                </td>
                <td>{row.email}</td>
                <td>{row.department}</td>
                <td>{row.status}</td>
                <td>{row.presentDays}</td>
                <td>{row.leaveDays}</td>
                <td>{row.absentDays}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "8px" }}>
                  No data for selected month
                </td>
              </tr>
            )}
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Attendance;
