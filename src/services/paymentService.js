import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class PaymentService {
  /**
   * Create a payment order for a booking
   * @param {string} bookingId - Booking ID
   * @returns {Object} Order details
   */
  async createPaymentOrder(bookingId) {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  /**
   * Verify payment with backend
   * @param {string} orderId - Order ID
   * @param {string} paymentId - Payment ID
   * @param {string} signature - Payment signature
   * @returns {Object} Verification result
   */
  async verifyPayment(orderId, paymentId, signature) {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId, paymentId, signature }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Get payment methods
   * @returns {Object} Available payment methods
   */
  async getPaymentMethods() {
    try {
      const response = await fetch('/api/payments/methods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Get payment breakdown for a booking
   * @param {string} bookingId - Booking ID
   * @returns {Object} Payment breakdown
   */
  async getPaymentBreakdown(bookingId) {
    try {
      const response = await fetch(`/api/payments/breakdown/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch payment breakdown');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment breakdown:', error);
      throw error;
    }
  }

  /**
   * Process refund
   * @param {string} paymentId - Payment ID
   * @param {number} amount - Amount to refund
   * @param {string} reason - Refund reason
   * @returns {Object} Refund result
   */
  async processRefund(paymentId, amount, reason) {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ paymentId, amount, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Initialize Razorpay payment
   * @param {Object} order - Order details from backend
   * @param {Object} user - User details
   * @param {Function} onSuccess - Success callback
   * @param {Function} onFailure - Failure callback
   */
  initializeRazorpayPayment(order, user, onSuccess, onFailure) {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Consultant Space',
      description: `Booking ${order.receipt}`,
      order_id: order.orderId,
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone || '',
      },
      notes: {
        bookingId: order.receipt,
      },
      theme: {
        color: '#10B981',
      },
      handler: async (response) => {
        try {
          const verificationResult = await this.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          
          if (verificationResult.success) {
            onSuccess(verificationResult);
          } else {
            onFailure({ message: 'Payment verification failed' });
          }
        } catch (error) {
          onFailure(error);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure({ message: 'Payment cancelled by user' });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount in paise
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency
   */
  formatCurrency(amount, currency = 'INR') {
    // Convert paise to rupees if needed
    const displayAmount = amount > 1000 ? amount / 100 : amount;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(displayAmount);
  }

  /**
   * Check if Razorpay is loaded
   * @returns {boolean} Whether Razorpay is available
   */
  isRazorpayLoaded() {
    return typeof window !== 'undefined' && window.Razorpay;
  }

  /**
   * Load Razorpay script
   * @returns {Promise} Script loading promise
   */
  async loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (this.isRazorpayLoaded()) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Get payment status text
   * @param {string} status - Payment status
   * @returns {string} Human readable status
   */
  getPaymentStatusText(status) {
    const statusMap = {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  }

  /**
   * Get payment method text
   * @param {string} method - Payment method
   * @returns {string} Human readable method
   */
  getPaymentMethodText(method) {
    const methodMap = {
      card: 'Credit/Debit Card',
      netbanking: 'Net Banking',
      upi: 'UPI',
      wallet: 'Digital Wallet',
      emi: 'EMI',
      manual: 'Manual Payment',
    };
    return methodMap[method] || method;
  }

  /**
   * Validate payment amount
   * @param {number} amount - Amount to validate
   * @returns {boolean} Whether amount is valid
   */
  validateAmount(amount) {
    return amount > 0 && amount <= 1000000; // Max 10 lakhs
  }

  /**
   * Calculate platform fee
   * @param {number} amount - Base amount
   * @param {number} feePercentage - Fee percentage (default 10%)
   * @returns {number} Platform fee
   */
  calculatePlatformFee(amount, feePercentage = 10) {
    return Math.round((amount * feePercentage) / 100);
  }

  /**
   * Get payment error message
   * @param {string} errorCode - Error code
   * @returns {string} User friendly error message
   */
  getPaymentErrorMessage(errorCode) {
    const errorMessages = {
      'PAYMENT_DECLINED': 'Payment was declined by your bank. Please try a different payment method.',
      'INSUFFICIENT_FUNDS': 'Insufficient funds in your account. Please check your balance.',
      'CARD_EXPIRED': 'Your card has expired. Please use a different card.',
      'INVALID_CARD': 'Invalid card details. Please check and try again.',
      'NETWORK_ERROR': 'Network error occurred. Please check your connection and try again.',
      'TIMEOUT': 'Payment request timed out. Please try again.',
      'CANCELLED': 'Payment was cancelled.',
      'DEFAULT': 'Payment failed. Please try again or contact support.',
    };
    return errorMessages[errorCode] || errorMessages['DEFAULT'];
  }
}

export default new PaymentService();
