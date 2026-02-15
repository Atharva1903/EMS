import { useContext, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { AuthContext } from "../../context/auth-context";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { changePassword } from "../../services/authService";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(oldPassword, newPassword);
      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <h1>My Profile</h1>
      {user && (
        <div style={{ marginTop: "16px" }}>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      <div style={{ marginTop: "32px", maxWidth: "400px" }}>
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="success" disabled={submitting}>
            {submitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default Profile;
