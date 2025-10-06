// Public consultant search service (no authentication required)
export const publicConsultantService = {
  // Search consultants publicly
  searchConsultants: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await fetch(`/api/consultants/public/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in public consultant search:', error);
      throw error;
    }
  },

  // Get public consultant profile
  getPublicProfile: async (consultantId) => {
    try {
      const response = await fetch(`/api/consultants/${consultantId}/public-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching public profile:', error);
      throw error;
    }
  },

  // Get available domains
  getDomains: async () => {
    try {
      const response = await fetch('/api/consultants/domains', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch domains');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  },

  // Store intended consultant for post-signup redirect
  storeIntendedConsultant: (consultantId) => {
    localStorage.setItem('intendedConsultantId', consultantId);
  },

  // Get and clear intended consultant
  getAndClearIntendedConsultant: () => {
    const consultantId = localStorage.getItem('intendedConsultantId');
    if (consultantId) {
      localStorage.removeItem('intendedConsultantId');
    }
    return consultantId;
  }
}; 