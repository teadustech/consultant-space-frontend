import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const consultantService = {
  // Search consultants with filters (authenticated - for seekers only)
  searchConsultants: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${API_BASE_URL}/consultants/search?${params}`, {
        headers: getAuthHeaders()
      });
      
      // Return the consultants array from the response
      return response.data.consultants || response.data;
    } catch (error) {
      console.error('Error searching consultants:', error);
      throw error;
    }
  },

  // Public search consultants (no authentication required)
  publicSearchConsultants: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${API_BASE_URL}/consultants/public/search?${params}`);
      return response.data.consultants || response.data;
    } catch (error) {
      console.error('Error searching consultants:', error);
      throw error;
    }
  },

  // Get available domains
  getDomains: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultants/domains`);
      return response.data;
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  },

  // Get consultant profile (authenticated)
  getConsultantProfile: async (consultantId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultants/${consultantId}/profile`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consultant profile:', error);
      throw error;
    }
  },

  // Get public consultant profile (no authentication)
  getPublicConsultantProfile: async (consultantId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultants/${consultantId}/public-profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public consultant profile:', error);
      throw error;
    }
  },

  // Get consultant's own profile (for editing)
  getMyProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultants/profile/me`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  },

  // Update consultant profile
  updateProfile: async (updateData) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await axios.put(`${API_BASE_URL}/consultants/${userData.id}/profile`, updateData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}; 