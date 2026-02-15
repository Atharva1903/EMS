import api from "./api";

export const getDepartments = () => {
  return api.get("/api/departments");
};

export const createDepartment = (data) => {
  return api.post("/api/departments", data);
};

export const deleteDepartment = (id) => {
  return api.delete(`/api/departments/${id}`);
};
