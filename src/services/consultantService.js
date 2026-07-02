import axios from 'axios';
import { apiUrl } from '../config/api';

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

      const response = await axios.get(apiUrl(`/api/consultants/search?${params}`), {
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

      const response = await axios.get(apiUrl(`/api/consultants/public/search?${params}`));
      return response.data.consultants || response.data;
    } catch (error) {
      console.error('Error searching consultants:', error);
      throw error;
    }
  },

  // Get available domains
  getDomains: async () => {
    try {
      const response = await axios.get(apiUrl('/api/consultants/domains'));
      return response.data;
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  },

  // Get consultant profile (authenticated)
  getConsultantProfile: async (consultantId) => {
    try {
      const response = await axios.get(apiUrl(`/api/consultants/${consultantId}/profile`), {
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
      const response = await axios.get(apiUrl(`/api/consultants/${consultantId}/public-profile`));
      return response.data;
    } catch (error) {
      console.error('Error fetching public consultant profile:', error);
      throw error;
    }
  },

  // Get consultant's own profile (for editing)
  getMyProfile: async () => {
    try {
      const response = await axios.get(apiUrl('/api/consultants/profile/me'), {
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
      const userData = JSON.parse(localStorage.getItem('userData'));
      const consultantId = userData?.id || userData?._id;

      if (!consultantId) {
        throw new Error('Consultant id is missing from local session');
      }

      const response = await axios.put(apiUrl(`/api/consultants/${consultantId}/profile`), updateData, {
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
  },

  // Update consultant rates
  updateRates: async (rateData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const consultantId = userData?.id || userData?._id;

      if (!consultantId) {
        throw new Error('Consultant id is missing from local session');
      }

      const response = await axios.put(apiUrl(`/api/consultants/${consultantId}/rates`), rateData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating rates:', error);
      throw error;
    }
  }
};
