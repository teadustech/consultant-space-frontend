import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { bookingService } from "../services/bookingService";
import paymentService from "../services/paymentService";
import { 
  FiX, 
  FiDollarSign, 
  FiClock, 
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiCreditCard,
  FiCheckCircle
} from "react-icons/fi";

export default function ServiceBookingModal({ 
  service, 
  consultant, 
  isOpen, 
  onClose, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
    preferredTime: ""
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const parseDurationMinutes = (duration) => {
    if (!duration) return 60;
    const value = String(duration).toLowerCase();
    const number = Number(value.match(/\d+(\.\d+)?/)?.[0] || 1);
    if (value.includes("hour")) return Math.max(15, Math.round(number * 60));
    if (value.includes("min")) return Math.max(15, Math.round(number));
    return 60;
  };

  useEffect(() => {
    // Pre-fill form with user data if logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (!token || userType !== 'seeker') {
        setError("Please login as a seeker before booking a service.");
        setLoading(false);
        return;
      }

      if (!formData.preferredDate || !formData.preferredTime) {
        setError("Preferred date and time are required for payment booking.");
        setLoading(false);
        return;
      }

      const consultantId = consultant.id || consultant._id;
      if (!consultantId) {
        setError("Consultant profile is missing booking details. Please try from the consultant directory.");
        setLoading(false);
        return;
      }

      const result = await bookingService.createBooking({
        consultantId,
        sessionType: "consultation",
        sessionDuration: parseDurationMinutes(service.duration),
        sessionDate: formData.preferredDate,
        startTime: formData.preferredTime,
        meetingPlatform: "google_meet",
        description: [
          `Service: ${service.name}`,
          service.description ? `Service description: ${service.description}` : "",
          formData.message ? `Seeker message: ${formData.message}` : ""
        ].filter(Boolean).join("\n"),
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: Number(service.price)
      });

      setBooking(result.booking);
      setStep(2);
    } catch (error) {
      console.error('Service booking error:', error);
      setError(error.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (!booking?._id) {
        throw new Error("Booking is missing. Please submit the service details again.");
      }

      await paymentService.loadRazorpayScript();
      const orderResponse = await paymentService.createPaymentOrder(booking._id);
      const user = JSON.parse(localStorage.getItem('userData') || '{}');

      paymentService.initializeRazorpayPayment(
        orderResponse.order,
        user,
        () => {
          setLoading(false);
          setStep(3);
        },
        (failureResult) => {
          setLoading(false);
          setError(failureResult.message || "Payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error('Service payment error:', error);
      setError(error.message || "Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (step === 3) {
      onSuccess();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {step === 1 && "Book Service"}
            {step === 2 && "Payment"}
            {step === 3 && "Booking Confirmed"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <FiX className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Service Details & Form */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Service Summary */}
              <Card className="border-brand-teal/20 bg-brand-teal/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{consultant.fullName}</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      ₹{service.price}
                    </Badge>
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {service.duration && (
                      <div className="flex items-center gap-1">
                        <FiClock className="h-4 w-4" />
                        {service.duration}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FiDollarSign className="h-4 w-4" />
                      Pay online to confirm
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9703527689"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions..."
                    rows={3}
                  />
                </div>

                <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
                  <h4 className="font-medium text-brand-teal mb-2">Payment Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Full online payment is required to confirm the booking.</p>
                    <p>Google Meet details are generated after successful payment.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-brand-teal hover:bg-brand-teal/90"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCreditCard className="h-8 w-8 text-brand-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Your Payment</h3>
                <p className="text-muted-foreground">
                  Pay the advance amount to confirm your booking
                </p>
              </div>

              <Card className="border-brand-teal/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">₹{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Payment Amount:</span>
                    <span className="font-medium text-brand-teal">₹{booking?.amount || service.price}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="font-medium">Pending</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
                <h4 className="font-medium text-brand-teal mb-2">Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  Razorpay checkout will open securely to complete your payment.
                </p>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full bg-brand-teal hover:bg-brand-teal/90"
                disabled={loading}
              >
                {loading ? "Processing Payment..." : "Pay Now (₹" + (booking?.amount || service.price) + ")"}
              </Button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FiCheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your service booking has been submitted successfully.
                </p>
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-800 mb-2">What Happens Next?</h4>
                  <ul className="text-sm text-green-700 space-y-1 text-left">
                    <li>• Consultant will review your booking request</li>
                    <li>• You'll receive confirmation email once approved</li>
                    <li>• Your payment has been verified</li>
                    <li>• You can track this booking from My Bookings</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button onClick={handleClose} className="w-full">
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
