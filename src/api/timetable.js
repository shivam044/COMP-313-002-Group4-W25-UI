import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new timetable entry
export const createTimeTable = async (timeTableData) => {
  try {
    const response = await axiosInstance.post('/api/timetable', timeTableData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating timetable entry', error);
    throw error;
  }
};

// Get a timetable entry by ID
export const getTimeTableById = async (timeTableId) => {
  try {
    const response = await axiosInstance.get(`/api/timetable/${timeTableId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting timetable entry by ID', error);
    throw error;
  }
};

// Update a timetable entry by ID
export const updateTimeTable = async (timeTableId, timeTableData) => {
  try {
    const response = await axiosInstance.put(`/api/timetable/${timeTableId}`, timeTableData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating timetable entry', error);
    throw error;
  }
};

// Delete a timetable entry by ID
export const deleteTimeTable = async (timeTableId) => {
  try {
    const response = await axiosInstance.delete(`/api/timetable/${timeTableId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting timetable entry', error);
    throw error;
  }
};

// Get timetable entries by user ID
export const getTimeTableByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/timetable/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting timetable entries by user ID', error);
    throw error;
  }
};

// Get all timetable entries
export const getAllTimeTables = async () => {
  try {
    const response = await axiosInstance.get('/api/timetable');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all timetable entries', error);
    throw error;
  }
};
