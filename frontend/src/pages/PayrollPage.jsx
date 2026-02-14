import { useEffect, useState } from "react";
import API from "../services/api";

const PayrollPage = () => {
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const { data } = await API.get("/payroll");
        setPayroll(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPayroll();
  }, []);

  return (
    <div>
      <h2>Payroll Details</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payroll.map((p) => (
            <tr key={p._id}>
              <td>{p.month}</td>
              <td>{p.year}</td>
              <td>{p.netSalary}</td>
              <td>{p.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollPage;
