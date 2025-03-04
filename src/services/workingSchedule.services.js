import axiosInstance from "./axiosInstance";

export const getAllWorkingSchedule = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/working-schedules`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkingScheduleDetailById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/working-schedules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveWorkingSchedule = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/working-schedules/${id}/approve`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const declineWorkingSchedule = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/working-schedules/${id}/decline`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerWorkingSchedule = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/working-schedules/sign-up`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSlots = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/slots`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSlot = async () => {
  try {
    const response = await axiosInstance.post(`/api/v1/slots`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
