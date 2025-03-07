import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post('/api/feedback', feedbackData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating feedback', error);
    throw error;
  }
};

// Get feedback by ID
export const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axiosInstance.get(`/api/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting feedback by ID', error);
    throw error;
  }
};

// Update feedback by ID
export const updateFeedback = async (feedbackId, feedbackData) => {
  try {
    const response = await axiosInstance.put(`/api/feedback/${feedbackId}`, feedbackData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating feedback', error);
    throw error;
  }
};

// Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await axiosInstance.delete(`/api/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting feedback', error);
    throw error;
  }
};

// Get feedback by student ID
export const getFeedbackByStudent = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/api/feedback/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting feedback by student ID', error);
    throw error;
  }
};

// Get feedback by assignment ID
export const getFeedbackByAssignment = async (assignmentId) => {
  try {
    const response = await axiosInstance.get(`/api/feedback/assignment/${assignmentId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting feedback by assignment ID', error);
    throw error;
  }
};

// Get feedback by subject ID
export const getFeedbackBySubject = async (subjectId) => {
  try {
    const response = await axiosInstance.get(`/api/feedback/subject/${subjectId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting feedback by subject ID', error);
    throw error;
  }
};

// Get all feedback for a student
export const getAllFeedbackByStudent = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/api/feedback/student/${studentId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    handleApiError('Error getting all feedback for student', error);
    throw error;
  }
};

// Get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await axiosInstance.get('/api/feedback');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all feedback', error);
    throw error;
  }
};
