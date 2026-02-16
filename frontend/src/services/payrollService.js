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

export const runBulkPayroll = (data) => {
  return api.post("/api/payroll/run-bulk", data);
};

export const updatePayrollStatus = (id) => {
  return api.put(`/api/payroll/${id}/pay`);
};

export const deletePayroll = (id) => {
  return api.delete(`/api/payroll/${id}`);
};

export const deleteAllPayrolls = () => {
  return api.delete("/api/payroll");
};
