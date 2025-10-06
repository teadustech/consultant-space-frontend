// Admin service for API calls
const API_BASE = '/api/admin';

export const adminService = {
  // Authentication
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update admin profile error:', error);
      throw error;
    }
  },

  // Dashboard
  getDashboardOverview: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/dashboard/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dashboard overview error:', error);
      throw error;
    }
  },

  // User Management
  getConsultants: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE}/consultants?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch consultants');
      }

      return await response.json();
    } catch (error) {
      console.error('Get consultants error:', error);
      throw error;
    }
  },

  getSeekers: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE}/seekers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seekers');
      }

      return await response.json();
    } catch (error) {
      console.error('Get seekers error:', error);
      throw error;
    }
  },

  updateConsultantVerification: async (consultantId, isVerified) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/consultants/${consultantId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update verification status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update consultant verification error:', error);
      throw error;
    }
  },

  updateConsultantAvailability: async (consultantId, isAvailable) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/consultants/${consultantId}/availability`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update availability status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update consultant availability error:', error);
      throw error;
    }
  },

  deleteUser: async (userType, userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/users/${userType}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // Seeker Management
  toggleSeekerVerification: async (seekerId, isVerified) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/seekers/${seekerId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update verification status');
      }

      return await response.json();
    } catch (error) {
      console.error('Toggle seeker verification error:', error);
      throw error;
    }
  },

  deleteSeeker: async (seekerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/seekers/${seekerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete seeker');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete seeker error:', error);
      throw error;
    }
  },

  // Admin Management (Super Admin Only)
  getAdmins: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      return await response.json();
    } catch (error) {
      console.error('Get admins error:', error);
      throw error;
    }
  },

  createAdmin: async (adminData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  },

  updateAdmin: async (adminId, adminData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  },

  // System Settings
  getSettings: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  updateSettings: async (settings) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (timeRange = '6months') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  },

  // Logs
  getLogs: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE}/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Get logs error:', error);
      throw error;
    }
  },

  exportLogs: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE}/logs/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Export logs error:', error);
      throw error;
    }
  }
}; 