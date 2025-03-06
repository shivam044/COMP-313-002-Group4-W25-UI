import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new teacher
export const createTeacher = async (teacherData) => {
  try {
    const response = await axiosInstance.post('/api/teacher', teacherData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating teacher', error);
    throw error;
  }
};

// Get a teacher by ID
export const getTeacherById = async (teacherId) => {
  try {
    const response = await axiosInstance.get(`/api/teachers/${teacherId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting teacher by ID', error);
    throw error;
  }
};

// Update a teacher by ID
export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const response = await axiosInstance.put(`/api/teachers/${teacherId}`, teacherData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating teacher', error);
    throw error;
  }
};

// Delete a teacher by ID
export const deleteTeacher = async (teacherId) => {
  try {
    const response = await axiosInstance.delete(`/api/teachers/${teacherId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting teacher', error);
    throw error;
  }
};

// Get teachers by user ID
export const getTeachersByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/teachers/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting teachers by user ID', error);
    throw error;
  }
};

// Get all teachers
export const getAllTeachers = async () => {
  try {
    const response = await axiosInstance.get('/api/teachers');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all teachers', error);
    throw error;
  }
};
