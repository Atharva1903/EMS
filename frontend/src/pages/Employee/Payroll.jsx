import { useEffect, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getMyPayroll } from "../../services/payrollService";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <EmployeeLayout>
      <h1>My Payroll</h1>
      {loading && <Loader />}
      {!loading && (
        <Table
          headers={[
            "Month",
            "Year",
            "Basic",
            "Bonus",
            "Deductions",
            "Net Salary",
            "Status"
          ]}
        >
          {payrolls.map((pay) => (
            <tr key={pay._id}>
              <td>{pay.month}</td>
              <td>{pay.year}</td>
              <td>{pay.basicSalary}</td>
              <td>{pay.bonus}</td>
              <td>{pay.deductions}</td>
              <td>{pay.netSalary}</td>
              <td>{pay.paymentStatus}</td>
            </tr>
          ))}
        </Table>
      )}
    </EmployeeLayout>
  );
};

export default Payroll;
