import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import employeeService from "../../services/employeeService";
import html2canvas from "html2canvas";
import { FaFilePdf, FaFileWord, FaShareAlt } from "react-icons/fa"; // Import React Icons
import jsPDF from "jspdf";
// Import for Word Export
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const [letterData, setLetterData] = useState({
    companyName: "PIXAFLIP TECHNOLOGIES PVT LTD",
    companyAddress: "404, Business Hub, Digital Sector, Bangalore - 560001",
    companyContact: "hr@pixaflip.com | +91 98765 43210",
    date: new Date().toISOString().split("T")[0],
    joiningDate: "",
    lastWorkingDay: new Date().toISOString().split("T")[0],
    designation: "",
    department: "",
    performance:
      "During their tenure, they demonstrated exceptional professionalism, dedication, and a strong work ethic. They were a valuable asset to the team, and their contributions were highly appreciated.",
    signatoryName: "John Doe",
    signatoryDesignation: "Human Resources Manager",
  });

  const letterRef = useRef(null);

  // --- STYLES ---
  const styles = {
    // ... existing styles ...
    container: { minHeight: "100vh", padding: "40px", backgroundColor: "#f1f5f9", fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: "30px" },
    title: { fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle: { color: "#64748b", fontSize: "14px", marginTop: "4px" },
    mainGrid: { display: "grid", gridTemplateColumns: "350px 1fr", gap: "40px", alignItems: "start" },
    card: { backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", border: "1px solid #e2e8f0" },
    input: { width: "100%", padding: "12px", marginBottom: "16px", border: "1px solid #cbd5e0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
    previewWrapper: { backgroundColor: "#cbd5e0", padding: "40px", borderRadius: "24px", display: "flex", justifyContent: "center", overflowX: "auto" },
    a4Paper: { width: "210mm", minHeight: "297mm", padding: "25mm 20mm", backgroundColor: "white", boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)", boxSizing: "border-box", lineHeight: "1.7", color: "#1a1a1a", fontFamily: "'Times New Roman', Times, serif" },
    
   // --- Updated Button Styles in your styles object ---
    buttonGroup: { 
      display: "grid", 
      gridTemplateColumns: "1fr", 
      gap: "10px", 
      marginTop: "10px",
    },
    btnPdf: { 
      width: "100%", 
      padding: "12px", 
      backgroundColor: "#ef4444", 
      color: "white", 
      border: "none", 
      borderRadius: "8px", 
      fontWeight: "600", 
      cursor: "pointer",
      display: "flex",       // Added for icon alignment
      alignItems: "center",   // Centers icon and text vertically
      justifyContent: "center", // Centers content horizontally
      gap: "8px"             // Space between icon and text
    },
    btnWord: { 
      width: "100%", 
      padding: "12px", 
      backgroundColor: "#2563eb", 
      color: "white", 
      border: "none", 
      borderRadius: "8px", 
      fontWeight: "600", 
      cursor: "pointer",
      display: "flex",       // Added for icon alignment
      alignItems: "center", 
      justifyContent: "center", 
      gap: "8px" 
    },
    btnShare: { 
      width: "100%", 
      padding: "12px", 
      backgroundColor: "#10b981", 
      color: "white", 
      border: "none", 
      borderRadius: "8px", 
      fontWeight: "600", 
      cursor: "pointer",
      display: "flex",       // Added for icon alignment
      alignItems: "center", 
      justifyContent: "center", 
      gap: "8px" 
    },
  };

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

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const employee = employees.find((emp) => String(emp._id) === empId);
    setSelectedEmployee(employee);

    if (employee) {
      setLetterData((prev) => ({
        ...prev,
        designation: employee.designation || "",
        department: employee.department || "",
        joiningDate: employee.createdAt ? employee.createdAt.split("T")[0] : "",
      }));
    }
  };

  // 1. PDF DOWNLOAD LOGIC
  const downloadPDF = async () => {
    const element = letterRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Experience_Letter_${selectedEmployee?.userId?.fullName || "Employee"}.pdf`);
  };

  // 2. WORD DOWNLOAD LOGIC
  const downloadWord = () => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Company Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: letterData.companyName, bold: true, size: 32, allCaps: true }),
              new TextRun({ text: `\n${letterData.companyAddress}`, size: 20 }),
              new TextRun({ text: `\n${letterData.companyContact}`, size: 18, color: "666666" }),
            ],
            spacing: { after: 400 },
          }),

          // Horizontal Line (Border)
          new Paragraph({
            border: { bottom: { color: "000000", space: 1, value: "single", size: 12 } },
            spacing: { after: 400 },
          }),

          // Date
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `Date: `, bold: true }),
              new TextRun({ text: new Date(letterData.date).toLocaleDateString("en-GB") }),
            ],
            spacing: { after: 600 },
          }),

          // Subject
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "TO WHOM IT MAY CONCERN", bold: true, underline: { type: "single" }, size: 28 }),
            ],
            spacing: { after: 600 },
          }),

          // Body Content
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            lineSpacing: { line: 360 }, // 1.5 line spacing
            children: [
              new TextRun("This is to certify that "),
              new TextRun({ text: `Mr./Ms. ${selectedEmployee.userId?.fullName}`, bold: true }),
              new TextRun(" was employed with us from "),
              new TextRun({ text: new Date(letterData.joiningDate).toLocaleDateString("en-GB"), bold: true }),
              new TextRun(" to "),
              new TextRun({ text: new Date(letterData.lastWorkingDay).toLocaleDateString("en-GB"), bold: true }),
              new TextRun("."),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            lineSpacing: { line: 360 },
            children: [
              new TextRun("During this period, they served as a "),
              new TextRun({ text: letterData.designation, bold: true }),
              new TextRun(" in the "),
              new TextRun({ text: letterData.department || "Operations", bold: true }),
              new TextRun(" department."),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            text: letterData.performance,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "We wish them the very best in all their future endeavors.",
            spacing: { after: 800 },
          }),

          // Signature Section
          new Paragraph({
            children: [new TextRun({ text: `For ${letterData.companyName}`, bold: true })],
            spacing: { after: 800 }, // Space for physical signature
          }),

          // Placeholder for Digital Signature or Stamp
          new Paragraph({
            children: [
              new TextRun({ text: "__________________________", color: "CCCCCC" }),
              new TextRun({ text: `\n${letterData.signatoryName}`, bold: true }),
              new TextRun({ text: `\n${letterData.signatoryDesignation}` }),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Experience_Letter_${selectedEmployee?.userId?.fullName}.docx`);
    });
  };

  // 3. SHARE LOGIC (Placeholder)
  const handleShare = () => {
    alert("Share functionality coming soon!");
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Experience Letter Generator</h1>
          <p style={styles.subtitle}>Generate professional employee certificates manually.</p>
        </header>

        <div style={styles.mainGrid}>
          {/* LEFT PANEL */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, fontSize: "16px", color: "#334155" }}>Selection</h3>
              <select style={styles.input} onChange={handleEmployeeChange} value={selectedEmployee?._id || ""}>
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.userId?.fullName}</option>
                ))}
              </select>
            </div>

            {selectedEmployee && (
              <div style={styles.card}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>DESIGNATION</label>
                <input style={styles.input} type="text" value={letterData.designation} onChange={(e) => setLetterData({ ...letterData, designation: e.target.value })} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>JOINING</label>
                    <input style={styles.input} type="date" value={letterData.joiningDate} onChange={(e) => setLetterData({ ...letterData, joiningDate: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>RELIEVING</label>
                    <input style={styles.input} type="date" value={letterData.lastWorkingDay} onChange={(e) => setLetterData({ ...letterData, lastWorkingDay: e.target.value })} />
                  </div>
                </div>

                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>PERFORMANCE</label>
                <textarea style={{ ...styles.input, height: "100px", resize: "none" }} value={letterData.performance} onChange={(e) => setLetterData({ ...letterData, performance: e.target.value })} />

                <div style={styles.buttonGroup}>
                  <button style={styles.btnPdf} onClick={downloadPDF}>
                    <FaFilePdf size={18} /> Download PDF
                  </button>
                  
                  <button style={styles.btnWord} onClick={downloadWord}>
                    <FaFileWord size={18} /> Download Word
                  </button>
                  
                  <button style={styles.btnShare} onClick={handleShare}>
                    <FaShareAlt size={16} /> Share Letter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - PREVIEW */}
          <div style={styles.previewWrapper}>
            {selectedEmployee ? (
              <div ref={letterRef} style={styles.a4Paper}>
                <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "20px", marginBottom: "40px" }}>
                  <h2 style={{ margin: 0, fontSize: "24px", textTransform: "uppercase" }}>{letterData.companyName}</h2>
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#444" }}>{letterData.companyAddress}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#666", letterSpacing: "1px" }}>{letterData.companyContact}</p>
                </div>

                <div style={{ fontSize: "16px", textAlign: "justify" }}>
                  <p style={{ textAlign: "right", marginBottom: "40px" }}>
                    Date: <strong>{new Date(letterData.date).toLocaleDateString("en-GB")}</strong>
                  </p>
                  <h3 style={{ textAlign: "center", textDecoration: "underline", marginBottom: "40px" }}>TO WHOM IT MAY CONCERN</h3>
                  <p>
                    This is to certify that <strong>Mr./Ms. {selectedEmployee.userId?.fullName}</strong> was employed with us from{" "}
                    <strong>{new Date(letterData.joiningDate).toLocaleDateString("en-GB")}</strong> to{" "}
                    <strong>{new Date(letterData.lastWorkingDay).toLocaleDateString("en-GB")}</strong>.
                  </p>
                  <p>
                    During this period, they served as a <strong>{letterData.designation}</strong> in the <strong>{letterData.department || "Operations"}</strong> department.
                  </p>
                  <p style={{ margin: "25px 0" }}>{letterData.performance}</p>
                  <p>We wish them the very best in all their future endeavors.</p>
                </div>

                <div style={{ marginTop: "80px" }}>
                  <p>For <strong>{letterData.companyName}</strong></p>
                  <div style={{ height: "60px" }}></div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{letterData.signatoryName}</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>{letterData.signatoryDesignation}</p>
                </div>
              </div>
            ) : (
              <div style={{ color: "#94a3b8", fontSize: "18px", alignSelf: "center" }}>
                Select an employee to generate the document preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;