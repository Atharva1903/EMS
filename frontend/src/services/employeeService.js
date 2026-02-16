import api from "./api";

const employeeService = {
  getEmployees: async () => {
    const res = await api.get("/api/employees");
    return res.data;
  },

  deleteEmployee: (id) => {
    return api.delete(`/api/employees/${id}`);
  },

  createEmployee: (data) => {
    return api.post("/api/employees", data);
  },

  updateEmployee: async (id, employeeData) => {
    return await api.put(`/api/employees/${id}`, employeeData);
  },

  // Profile Methods
  fetchProfile: async () => {
    return await api.get("/api/employees/profile");
  },

  updateProfile: async (data) => {
    return await api.put("/api/employees/profile", data);
  }
};

export default employeeService;
