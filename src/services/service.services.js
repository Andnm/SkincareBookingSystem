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

export const updateService = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/services/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/services/${id}`);
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

export const updateSkinIssue = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/skin-issues/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSkinType = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/skin-types/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServiceType = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/types/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSkinIssue = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/skin-issues/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSkinType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/skin-types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServiceType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
