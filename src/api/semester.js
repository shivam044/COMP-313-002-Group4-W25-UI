import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new semester
export const createSemester = async (semesterData) => {
  try {
    const response = await axiosInstance.post('/api/semester', semesterData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating semester', error);
    throw error;
  }
};

// Get a semester by ID
export const getSemesterById = async (semesterId) => {
  try {
    const response = await axiosInstance.get(`/api/semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting semester by ID', error);
    throw error;
  }
};

// Update a semester by ID
export const updateSemester = async (semesterId, semesterData) => {
  try {
    const response = await axiosInstance.put(`/api/semesters/${semesterId}`, semesterData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating semester', error);
    throw error;
  }
};

// Delete a semester by ID
export const deleteSemester = async (semesterId) => {
  try {
    const response = await axiosInstance.delete(`/api/semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting semester', error);
    throw error;
  }
};

// Get semesters by user ID
export const getSemestersByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/semesters/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting semesters by user ID', error);
    throw error;
  }
};

// Get all semesters
export const getAllSemesters = async () => {
  try {
    const response = await axiosInstance.get('/api/semesters');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all semesters', error);
    throw error;
  }
};
