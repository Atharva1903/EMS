import api from "./api";

export const markToday = () => {
  return api.post("/api/attendance/mark");
};

export const getMyAttendance = () => {
  return api.get("/api/attendance/my");
};

export const getAllAttendance = () => {
  return api.get("/api/attendance");
};

