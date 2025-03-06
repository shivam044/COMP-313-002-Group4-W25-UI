import axiosInstance from './axiosInstance';
import { handleApiError } from './errorController';

/**
 * Sign in a user.
 * 
 * @async
 * @function signIn
 * @param {Object} credentials - The user's credentials for signing in.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} The response data containing the authentication token.
 * @throws {Error} If an error occurs while signing in.
 */
export const signIn = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/signin', credentials);
    const { token } = response.data;
    
    // Store token in localStorage
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  } catch (error) {
    handleApiError('Error signing in', error);
    throw error;
  }
};

/**
 * Sign out a user.
 * 
 * @async
 * @function signOut
 * @returns {Promise<Object>} The response data indicating the result of the sign-out operation.
 * @throws {Error} If an error occurs while signing out.
 */
export const signOut = async () => {
  try {
    // Remove token from localStorage
    localStorage.removeItem('token');
    const response = await axiosInstance.get('/auth/signout');
    // Or redirect the user to a login page, etc.
    return response.data;
  } catch (error) {
    handleApiError('Error signing out', error);
    throw error;
  }
};
