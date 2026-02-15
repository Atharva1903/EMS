import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <AdminSidebar />
      <div className="main-section">
        <AdminNavbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
