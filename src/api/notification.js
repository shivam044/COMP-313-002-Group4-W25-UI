import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post('/api/notification', notificationData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating notification', error);
    throw error;
  }
};

// Get a notification by ID
export const getNotificationById = async (notificationId) => {
  try {
    const response = await axiosInstance.get(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting notification by ID', error);
    throw error;
  }
};

// Update a notification by ID
export const updateNotification = async (notificationId, notificationData) => {
  try {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}`, notificationData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating notification', error);
    throw error;
  }
};

// Delete a notification by ID
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting notification', error);
    throw error;
  }
};

// Get all notifications for the logged-in user
export const getAllNotifications = async () => {
  try {
    const response = await axiosInstance.get('/api/notifications');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all notifications', error);
    throw error;
  }
};

// Get all notifications for a specific user by ID
export const getNotificationsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status) {
      handleApiError(`Error getting all notifications for the user: ${error.response.statusText}`, error);
    } else {
      console.error("Unexpected error occurred while fetching notifications:", error);
    }
    throw error; // Ensure you re-throw the error for any further handling
  } 
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    handleApiError('Error marking notification as read', error);
    throw error;
  }
};
