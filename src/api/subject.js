import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await axiosInstance.post('/api/subject', subjectData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating subject', error);
    throw error;
  }
};

// Get a subject by ID
export const getSubjectById = async (subjectId) => {
  try {
    const response = await axiosInstance.get(`/api/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting subject by ID', error);
    throw error;
  }
};

// Update a subject by ID
export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await axiosInstance.put(`/api/subjects/${subjectId}`, subjectData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating subject', error);
    throw error;
  }
};

// Delete a subject by ID
export const deleteSubject = async (subjectId) => {
  try {
    const response = await axiosInstance.delete(`/api/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting subject', error);
    throw error;
  }
};

// Get subjects by user ID
export const getSubjectsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/subjects/user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting subjects by user ID', error);
    throw error;
  }
};

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const response = await axiosInstance.get('/api/subjects');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all subjects', error);
    throw error;
  }
};