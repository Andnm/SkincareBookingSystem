import axiosInstance from "./axiosInstance";

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/current");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUserByAdmin = async () => {
  try {
    const response = await axiosInstance.get(`/api/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};