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
    const response = await axiosInstance.get(`/api/v1/service-type`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllServices = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/services`);
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

export const createNewService = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/services/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};