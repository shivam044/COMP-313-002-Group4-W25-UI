import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await axiosInstance.post('/api/assignment', assignmentData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating assignment', error);
    throw error;
  }
};

// Get an assignment by ID
export const getAssignmentById = async (assignmentId) => {
  try {
    const response = await axiosInstance.get(`/api/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting assignment by ID', error);
    throw error;
  }
};

// Update an assignment by ID
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await axiosInstance.put(`/api/assignments/${assignmentId}`, assignmentData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating assignment', error);
    throw error;
  }
};

// Delete an assignment by ID
export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await axiosInstance.delete(`/api/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting assignment', error);
    throw error;
  }
};

// Get assignments by user ID
export const getAssignmentsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/assignments/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting assignments by user ID', error);
    throw error;
  }
};

// Get all assignments
export const getAllAssignments = async () => {
  try {
    const response = await axiosInstance.get('/api/assignments');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all assignments', error);
    throw error;
  }
};