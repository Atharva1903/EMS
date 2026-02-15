import api from "./api";

export const updateUser = (id, data) => {
  return api.put(`/api/users/${id}`, data);
};
