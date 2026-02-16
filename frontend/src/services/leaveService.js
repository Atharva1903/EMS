import api from "./api";

export const getAllLeaves = () => {
  return api.get("/api/leaves");
};

export const applyLeave = (data) => {
  return api.post("/api/leaves", data);
};

export const updateLeaveStatus = (id, data) => {
  return api.put(`/api/leaves/${id}`, data);
};

export const getMyLeaves = () => {
  return api.get("/api/leaves/my");
};

export const getLeaves = getAllLeaves;
