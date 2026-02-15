import api from "./api";

export const getEmployeeCount = async () => {
  return api.get("/api/employees/stats/count");
};

export const getLeaveStats = async () => {
  return api.get("/api/leaves/stats");
};

export const getPayrollStats = async () => {
  return api.get("/api/payroll/stats");
};
