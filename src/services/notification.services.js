import axiosInstance from "./axiosInstance";

export const getAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNotification = async (data, user_id) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/notifications/${user_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotificationById = async (noti_id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/notifications/${noti_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markOneNotificationAsRead = async (noti_id) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/notifications/${noti_id}/read`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put(`/api/v1/notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
