import axiosInstance from "./axiosInstance";

export const getAllBookingSlotByBookingId = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/bookings/${id}/booking-slots`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingSlotDetailByBookingSlotId = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/booking-slots/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkInBookingSlots = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/booking-slots/${id}/check-in`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkOutBookingSlots = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/booking-slots/${id}/check-out`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNoteResultBookingSlots = async (id, data) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/booking-slots/${id}/note-result`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
