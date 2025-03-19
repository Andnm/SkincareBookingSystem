import axiosInstance from "./axiosInstance";

export const createFeedbacks = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/feedbacks`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRating = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/ratings`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
