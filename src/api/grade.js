import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new grade
export const createGrade = async (gradeData) => {
  try {
    const response = await axiosInstance.post('/api/grade', gradeData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating grade', error);
    throw error;
  }
};

// Get a grade by ID
export const getGradeById = async (gradeId) => {
  try {
    const response = await axiosInstance.get(`/api/grades/${gradeId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting grade by ID', error);
    throw error;
  }
};

// Update a grade by ID
export const updateGrade = async (gradeId, gradeData) => {
  try {
    const response = await axiosInstance.put(`/api/grades/${gradeId}`, gradeData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating grade', error);
    throw error;
  }
};

// Delete a grade by ID
export const deleteGrade = async (gradeId) => {
  try {
    const response = await axiosInstance.delete(`/api/grades/${gradeId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting grade', error);
    throw error;
  }
};

// Get grades by user ID
export const getGradesByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/grades/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting grades by user ID', error);
    throw error;
  }
};

// Get all grades
export const getAllGrades = async () => {
  try {
    const response = await axiosInstance.get('/api/grades');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all grades', error);
    throw error;
  }
};