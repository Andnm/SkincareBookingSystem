import axiosInstance from "./axiosInstance";

export const getAllAccounts = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/accounts`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSkinTherapists = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/skin-therapists/get-all`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccountByManager = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/accounts/provide`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
