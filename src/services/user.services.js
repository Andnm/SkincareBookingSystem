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

export const getAccountById = async (accountId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccounts = async (data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/accounts`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSkinTherapists = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/skin-therapists/get-all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccountByManager = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/accounts/provide`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const provideSkinTherapistInfo = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/skin-therapists`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
