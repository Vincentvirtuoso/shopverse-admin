import api from "./axiosInstance";

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  checkAdminAccess: async () => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data?.user || response.data;
      return user.role === "super_admin";
    } catch (error) {
      console.log(error);

      return false;
    }
  },
};
