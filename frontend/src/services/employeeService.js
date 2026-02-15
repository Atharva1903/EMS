import api from "./api";

export const getEmployees = async () => {
  const res = await api.get("/api/employees");
  return res.data;
};

export const deleteEmployee = (id) => {
  return api.delete(`/api/employees/${id}`);
};

export const createEmployee = (data) => {
  return api.post("/api/employees", data);
};

export const updateEmployee = (id, data) => {
  return api.put(`/api/employees/${id}`, data);
};
