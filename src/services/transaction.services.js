import axiosInstance from "./axiosInstance";

export const getAllTransactions = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/transactions`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
