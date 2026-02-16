import { useEffect, useState, useMemo } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getMyPayroll } from "../../services/payrollService";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyPayroll();
        setPayrolls(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique years from payroll data
  const availableYears = useMemo(() => {
    const years = [...new Set(payrolls.map(p => p.year))];
    return years.sort((a, b) => b - a);
  }, [payrolls]);

  // Filter payrolls by selected year
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(p => p.year === selectedYear).sort((a, b) => b.month - a.month);
  }, [payrolls, selectedYear]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalEarnings = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const latestPayroll = [...payrolls].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    })[0];
    const paidCount = payrolls.filter(p => p.paymentStatus === "Paid").length;
    const pendingCount = payrolls.filter(p => p.paymentStatus === "Pending").length;

    return {
      totalEarnings,
      latestSalary: latestPayroll?.netSalary || 0,
      paidCount,
      pendingCount
    };
  }, [payrolls]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getStatusStyle = (status) => {
    return status === "Paid"
      ? { background: "#dcfce7", color: "#166534" }
      : { background: "#fef3c7", color: "#92400e" };
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  return (
    <EmployeeLayout>
      <div style={container}>
        <h1>My Payroll</h1>

        {/* Stats Row */}
        <div style={statsGrid}>
          <div style={statCard}>
            <h3>Total Earnings</h3>
            <p style={{ fontSize: "1.8rem", margin: "10px 0", color: "#3b82f6", fontWeight: "600" }}>
              {formatCurrency(stats.totalEarnings)}
            </p>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Lifetime</span>
          </div>
          <div style={statCard}>
            <h3>Latest Salary</h3>
            <p style={{ fontSize: "1.8rem", margin: "10px 0", color: "#10b981", fontWeight: "600" }}>
              {formatCurrency(stats.latestSalary)}
            </p>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Most Recent</span>
          </div>
          <div style={statCard}>
            <h3>Paid</h3>
            <p style={{ fontSize: "1.8rem", margin: "10px 0", color: "#10b981", fontWeight: "600" }}>
              {stats.paidCount}
            </p>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Records</span>
          </div>
          <div style={statCard}>
            <h3>Pending</h3>
            <p style={{ fontSize: "1.8rem", margin: "10px 0", color: "#f59e0b", fontWeight: "600" }}>
              {stats.pendingCount}
            </p>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Records</span>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{ marginTop: "30px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ fontWeight: "500", color: "#334155" }}>Filter by Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={selectStyle}
          >
            {availableYears.length > 0 ? (
              availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))
            ) : (
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            )}
          </select>
        </div>

        {/* Payroll Table */}
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "16px" }}>Payroll History - {selectedYear}</h2>
          {loading ? (
            <Loader />
          ) : (
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <Table
                headers={[
                  "Month",
                  "Base Salary",
                  "HRA",
                  "Bonus",
                  "Gross",
                  "Deductions",
                  "LOP",
                  "Net Salary",
                  "Status"
                ]}
              >
                {filteredPayrolls.length > 0 ? filteredPayrolls.map((pay) => (
                  <tr key={pay._id}>
                    <td style={{ fontWeight: "500" }}>{monthNames[pay.month - 1]} {pay.year}</td>
                    <td>{formatCurrency(pay.basicSalary)}</td>
                    <td>{formatCurrency(pay.hra)}</td>
                    <td>{formatCurrency(pay.bonus)}</td>
                    <td style={{ fontWeight: "500" }}>{formatCurrency(pay.grossSalary)}</td>
                    <td style={{ color: "#dc2626" }}>{formatCurrency(pay.deductions)}</td>
                    <td style={{ color: "#dc2626" }}>{formatCurrency(pay.lopAmount)}</td>
                    <td style={{ fontWeight: "600", fontSize: "1.05rem", color: "#059669" }}>
                      {formatCurrency(pay.netSalary)}
                    </td>
                    <td>
                      <span style={{ ...statusBadge, ...getStatusStyle(pay.paymentStatus) }}>
                        {pay.paymentStatus}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                      No payroll records for {selectedYear}
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

/* --- STYLES --- */
const container = { paddingBottom: "40px" };
const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};
const statCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
  border: "1px solid #e2e8f0"
};
const selectStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "white",
  fontSize: "0.95rem",
  cursor: "pointer"
};
const statusBadge = {
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "0.85rem",
  fontWeight: "500",
  display: "inline-block"
};

export default Payroll;
