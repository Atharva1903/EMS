import EmployeeSidebar from "../components/empolyee/EmployeeSidebar";
import EmployeeNavbar from "../components/empolyee/EmployeeNavbar";

const EmployeeLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <EmployeeSidebar />
      <div className="main-section">
        <EmployeeNavbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
