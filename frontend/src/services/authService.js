import api from "./api";

export const changePassword = (oldPassword, newPassword) => {
  return api.post("/api/auth/change-password", {
    oldPassword,
    newPassword
  });
};

