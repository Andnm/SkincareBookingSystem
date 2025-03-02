import axiosInstance from "./axiosInstance";

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithRefreshToken = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/sign-in-with-refresh-token", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async (credentials) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/auth/authenticate-with-google",
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/v1/accounts/sign-up", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      `/api/users/forgotPassword/${email}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/users/resetPassword`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
