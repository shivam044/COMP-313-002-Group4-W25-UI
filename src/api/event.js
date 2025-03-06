import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    handleApiError('Error creating event', error);
    throw error;
  }
};

// Get an event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error getting event by ID', error);
    throw error;
  }
};

// Update an event by ID
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(`/api/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    handleApiError('Error updating event', error);
    throw error;
  }
};

// Delete an event by ID
export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error deleting event', error);
    throw error;
  }
};

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get('/api/events');
    return response.data;
  } catch (error) {
    handleApiError('Error getting all events', error);
    throw error;
  }
};
