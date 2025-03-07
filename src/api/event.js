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

// Get events for a specific user
export const getUserEvents = async (userId, type = null, past = false) => {
  try {
    let url = `/api/events/user/${userId}`;
    const params = new URLSearchParams();
    
    if (type) {
      params.append('type', type);
    }
    
    if (past) {
      params.append('past', 'true');
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleApiError('Error getting user events', error);
    throw error;
  }
};

// Schedule a meeting between advisor and student
export const scheduleMeeting = async (meetingData) => {
  try {
    const response = await axiosInstance.post('/api/events/meetings', meetingData);
    return response.data;
  } catch (error) {
    handleApiError('Error scheduling meeting', error);
    throw error;
  }
};

// Cancel a meeting by ID
export const cancelMeeting = async (meetingId) => {
  try {
    const response = await axiosInstance.delete(`/api/events/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    handleApiError('Error canceling meeting', error);
    throw error;
  }
};

// Get upcoming meetings for a specific user
export const getUserMeetings = async (userId, past = false) => {
  try {
    let url = `/api/events/user/${userId}?type=Meeting`;
    
    if (past) {
      url += '&past=true';
    }
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleApiError('Error getting user meetings', error);
    throw error;
  }
};