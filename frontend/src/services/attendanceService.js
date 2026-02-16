import api from "./api";

export const markToday = () => {
  return api.post("/api/attendance");
};

export const getMyAttendance = (month, year) => {
  return api.get(`/api/attendance/my?month=${month || ""}&year=${year || ""}`);
};

export const getAllAttendance = () => {
  return api.get("/api/attendance");
};

