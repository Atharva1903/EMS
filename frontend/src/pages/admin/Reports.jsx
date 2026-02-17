import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from "../../layouts/AdminLayout";
import employeeService from "../../services/employeeService";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [letterData, setLetterData] = useState({
    companyName: 'Company Name',
    companyAddress: '123 Business Street, Tech City',
    companyContact: 'info@company.com | +91 XXXXX XXXXX',
    date: new Date().toISOString().split('T')[0],
    joiningDate: '',
    lastWorkingDay: new Date().toISOString().split('T')[0],
    designation: '',
    department: '',
    performance:
      'During their tenure, they demonstrated professionalism, dedication, and strong work ethics.',
    signatoryName: 'Admin',
    signatoryDesignation: 'HR Manager'
  });

  const letterRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ handle dropdown change
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;

    const employee = employees.find(
      emp => String(emp._id) === empId
    );

    setSelectedEmployee(employee);

    if (employee) {
      setLetterData(prev => ({
        ...prev,
        designation: employee.designation || '',
        department: employee.department || '',
        joiningDate: employee.createdAt
          ? employee.createdAt.split('T')[0]
          : '',
      }));
    }
  };

  // ✅ PDF Download
  const downloadPDF = () => {
    const input = letterRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const empName =
        selectedEmployee?.userId?.fullName ||
        "Employee";

      pdf.save(`Experience_Letter_${empName}.pdf`);
    });
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          Experience Letter Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <div className="bg-white p-6 rounded-lg shadow-md">

            <label className="block mb-2 font-medium">
              Select Employee
            </label>

            <select
              className="w-full p-2 border rounded mb-6"
              onChange={handleEmployeeChange}
              value={selectedEmployee?._id || ''}
            >
              <option value="">-- Select Employee --</option>

              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.userId?.fullName || "Employee"} ({emp.employeeId || emp._id})
                </option>
              ))}
            </select>

            {selectedEmployee && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">

                  <input
                    type="text"
                    value={
                      selectedEmployee.userId?.fullName || "Employee"
                    }
                    disabled
                    className="p-2 border rounded bg-gray-100"
                  />

                  <input
                    type="text"
                    value={letterData.designation}
                    onChange={(e) =>
                      setLetterData({ ...letterData, designation: e.target.value })
                    }
                    placeholder="Designation"
                    className="p-2 border rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={letterData.department}
                    onChange={(e) =>
                      setLetterData({ ...letterData, department: e.target.value })
                    }
                    placeholder="Department"
                    className="p-2 border rounded"
                  />

                  <input
                    type="date"
                    value={letterData.joiningDate}
                    onChange={(e) =>
                      setLetterData({ ...letterData, joiningDate: e.target.value })
                    }
                    className="p-2 border rounded"
                  />
                </div>

                <textarea
                  rows="4"
                  value={letterData.performance}
                  onChange={(e) =>
                    setLetterData({ ...letterData, performance: e.target.value })
                  }
                  className="w-full p-2 border rounded mb-4"
                />

                <button
                  onClick={downloadPDF}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Download PDF
                </button>
              </>
            )}
          </div>

          {/* RIGHT PANEL (PREVIEW) */}
          <div className="bg-gray-200 p-8 rounded-lg overflow-auto">

            {selectedEmployee ? (
              <div
                ref={letterRef}
                className="bg-white p-12 shadow-lg mx-auto font-serif text-sm"
                style={{ width: '210mm', minHeight: '297mm' }}
              >

                <div className="text-center border-b pb-4 mb-8">
                  <h1 className="text-2xl font-bold">
                    {letterData.companyName}
                  </h1>
                  <p>{letterData.companyAddress}</p>
                  <p>{letterData.companyContact}</p>
                </div>

                <p className="text-right mb-6">
                  Date: {new Date(letterData.date).toLocaleDateString()}
                </p>

                <h2 className="text-center font-bold underline mb-6">
                  TO WHOM IT MAY CONCERN
                </h2>

                <p className="mb-4">
                  This is to certify that <strong>
                    {selectedEmployee.userId?.fullName || "Employee"}
                  </strong> (Employee ID: {selectedEmployee.employeeId})
                  worked with <strong>{letterData.companyName}</strong> from{" "}
                  <strong>
                    {new Date(letterData.joiningDate).toLocaleDateString()}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {new Date(letterData.lastWorkingDay).toLocaleDateString()}
                  </strong>.
                </p>

                <p className="mb-4">
                  They served as <strong>{letterData.designation}</strong> in the{" "}
                  <strong>{letterData.department}</strong> department.
                </p>

                <p className="mb-4">{letterData.performance}</p>

                <p>
                  We wish them success in their future endeavors.
                </p>

                <div className="mt-16">
                  <p>For {letterData.companyName}</p>
                  <br /><br />
                  <p className="font-bold">
                    {letterData.signatoryName}
                  </p>
                  <p>{letterData.signatoryDesignation}</p>
                </div>

              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select an employee to preview letter
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
