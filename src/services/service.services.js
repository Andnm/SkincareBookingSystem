import axiosInstance from "./axiosInstance";

export const getAllSkinIssue = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/skin-issues`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSkinType = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/skin-types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllServiceType = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllServices = async (params) => {
  try {
    const response = await axiosInstance.get(`/api/v1/services`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceDetailById = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewService = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/services/create`,
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

export const createSkinIssue = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/skin-issues`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSkinType = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/skin-types`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createServiceType = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/types`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
