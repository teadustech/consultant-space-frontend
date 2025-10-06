import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import paymentService from '../services/paymentService';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  consultant, 
  onPaymentSuccess, 
  onPaymentFailure 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);

  useEffect(() => {
    if (isOpen && booking) {
      loadPaymentData();
    }
  }, [isOpen, booking]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load payment methods
      const methodsResponse = await paymentService.getPaymentMethods();
      setPaymentMethods(methodsResponse.paymentMethods);

      // Load payment breakdown
      const breakdownResponse = await paymentService.getPaymentBreakdown(booking._id);
      setPaymentBreakdown(breakdownResponse.breakdown);

      // Set default payment method
      if (methodsResponse.paymentMethods.length > 0) {
        setSelectedMethod(methodsResponse.paymentMethods[0]);
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
      setError(error.message || 'Failed to load payment information');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load Razorpay script
      await paymentService.loadRazorpayScript();

      // Create payment order
      const orderResponse = await paymentService.createPaymentOrder(booking._id);
      
      // Get user details from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Initialize Razorpay payment
      paymentService.initializeRazorpayPayment(
        orderResponse.order,
        user,
        (successResult) => {
          console.log('Payment successful:', successResult);
          onPaymentSuccess(successResult);
        },
        (failureResult) => {
          console.error('Payment failed:', failureResult);
          setError(failureResult.message || 'Payment failed');
          onPaymentFailure(failureResult);
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Failed to process payment');
      onPaymentFailure(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Payment</CardTitle>
              <CardDescription>
                Complete your booking payment
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
              <span className="ml-2">Loading payment information...</span>
            </div>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!loading && booking && (
            <>
              {/* Booking Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consultant:</span>
                    <span className="font-medium">{consultant?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session Type:</span>
                    <span className="font-medium">{booking.sessionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{booking.sessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{formatDate(booking.sessionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{formatTime(booking.startTime)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              {paymentBreakdown && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Fee:</span>
                      <span className="font-medium">{formatCurrency(booking.amount)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg">{formatCurrency(booking.amount)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod?.id === method.id
                          ? 'border-brand-teal bg-brand-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      {selectedMethod?.id === method.id && (
                        <CheckCircle className="h-5 w-5 text-brand-teal ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Secure Payment</div>
                    <div className="text-gray-600">
                      Your payment information is protected with bank-level encryption
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={loading || !selectedMethod}
                  className="flex-1 bg-brand-teal hover:bg-brand-teal/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Contact Support for Payment
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;
