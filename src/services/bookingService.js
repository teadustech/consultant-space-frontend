const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class BookingService {
  // Create a new booking
  createBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  };

  // Get user's bookings
  getMyBookings = async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE}/bookings/my-bookings?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get my bookings error:', error);
      throw error;
    }
  };

  // Get upcoming bookings
  getUpcomingBookings = async (limit = 5) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings/upcoming?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch upcoming bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get upcoming bookings error:', error);
      throw error;
    }
  };

  // Get booking by ID
  getBookingById = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  };

  // Update booking status
  updateBookingStatus = async (bookingId, status, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reason })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update booking status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update booking status error:', error);
      throw error;
    }
  };

  // Add review to booking
  addReview = async (bookingId, rating, review = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, review })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add review');
      }

      return await response.json();
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  };

  // Get consultant availability
  getConsultantAvailability = async (consultantId, startDate, endDate) => {
    try {
      const response = await fetch(
        `${API_BASE}/bookings/consultant/${consultantId}/availability?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch availability');
      }

      return await response.json();
    } catch (error) {
      console.error('Get availability error:', error);
      throw error;
    }
  };

  // Reschedule booking
  rescheduleBooking = async (bookingId, sessionDate, startTime) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionDate, startTime })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reschedule booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Reschedule booking error:', error);
      throw error;
    }
  };

  // Cancel booking
  cancelBooking = async (bookingId, reason = '') => {
    return this.updateBookingStatus(bookingId, 'cancelled', reason);
  };

  // Confirm booking (for consultants)
  confirmBooking = async (bookingId) => {
    return this.updateBookingStatus(bookingId, 'confirmed');
  };

  // Complete booking (for consultants)
  completeBooking = async (bookingId) => {
    return this.updateBookingStatus(bookingId, 'completed');
  };

  // Mark as no show (for consultants)
  markAsNoShow = async (bookingId) => {
    return this.updateBookingStatus(bookingId, 'no_show');
  };

  // Utility methods
  formatBookingDate = (dateString) => {
    // Handle timezone issues by creating a consistent date object
    const date = new Date(dateString);
    
    // Use local date formatting to avoid timezone shifts
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Force UTC to avoid timezone conversion issues
    });
  };

  formatBookingTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning', // Keep warning color for pending approval
      confirmed: 'success', // Use success color for auto-approved bookings
      completed: 'success',
      cancelled: 'destructive',
      no_show: 'secondary',
      rescheduled: 'warning'
    };
    return statusColors[status] || 'default';
  };

  getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pending Approval',
      confirmed: 'Approved',
      completed: 'Completed',
      cancelled: 'Cancelled',
      no_show: 'No Show',
      rescheduled: 'Rescheduled'
    };
    return statusLabels[status] || status;
  };

  canCancelBooking = (booking) => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      console.log('Cannot cancel: Invalid status', booking.status);
      return false;
    }

    const now = new Date();
    
    // Create session date time properly (same logic as backend)
    let sessionDateTime = new Date(booking.sessionDate);
    
    // If the sessionDate doesn't have the time set (only date), set it from startTime
    if (sessionDateTime.getHours() === 0 && sessionDateTime.getMinutes() === 0) {
      const [hours, minutes] = booking.startTime.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);
    }
    
    // Can cancel up to 24 hours before the session
    const cancellationDeadline = new Date(sessionDateTime.getTime() - 24 * 60 * 60 * 1000);
    
    console.log('Frontend canCancelBooking check:', {
      bookingId: booking._id,
      now: now.toISOString(),
      sessionDate: booking.sessionDate,
      sessionDateTime: sessionDateTime.toISOString(),
      cancellationDeadline: cancellationDeadline.toISOString(),
      canCancel: now < cancellationDeadline
    });
    
    return now < cancellationDeadline;
  };

  canRescheduleBooking = (booking) => {
    return ['pending', 'confirmed'].includes(booking.status);
  };

  canAddReview = (booking, userType) => {
    return booking.status === 'completed' && 
           userType === 'seeker' && 
           !booking.rating;
  };
}

export const bookingService = new BookingService(); 