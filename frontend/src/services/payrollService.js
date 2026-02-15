import api from "./api";

export const getPayrolls = () => {
  return api.get("/api/payroll");
};

export const getMyPayroll = () => {
  return api.get("/api/payroll/my");
};

export const createPayroll = (data) => {
  return api.post("/api/payroll", data);
};
