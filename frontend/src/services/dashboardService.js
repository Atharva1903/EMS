import api from "./api";

export const getEmployeeCount = async () => {
  return api.get("/api/employees/stats/count");
};

export const getLeaveStats = async () => {
  return api.get("/api/leaves/stats");
};

export const getPayrollStats = async (month, year) => {
  let url = "/api/payroll/stats";
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }
  return api.get(url);
};

export const getAttendanceStats = async () => {
  return api.get("/api/attendance/stats");
};
