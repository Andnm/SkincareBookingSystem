import axiosInstance from "./axiosInstance";

export const getAllSlots = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/slots`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSlotById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/slots/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSlotByManager = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/slots/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookings = async (data) => {
  try {
    const response = await axiosInstance.get(`/api/v1/bookings`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingDetailById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBookings = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/bookings/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSkinTherapistByWorkingDateAndSlotId = async (params) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/skin-therapists/get-all-by-working-date-and-slotId`,
      {
        params: params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
