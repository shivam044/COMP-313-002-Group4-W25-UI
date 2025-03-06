import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create or update user settings
export const createOrUpdateUserSettings = async (settingsData) => {
  try {
    const response = await axiosInstance.post('/api/user-settings', settingsData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating or updating user settings', error);
    throw error;
  }
};

// Get user settings by user ID
export const getUserSettingsById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/user-settings/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting user settings by ID', error);
    throw error;
  }
};

// Delete user settings by user ID
export const deleteUserSettingsById = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/user-settings/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting user settings by ID', error);
    throw error;
  }
};
