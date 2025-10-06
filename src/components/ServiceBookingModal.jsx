import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
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
  const [advanceAmount] = useState(500); // Configurable advance amount

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
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      
      // Save booking to localStorage (in real app, this would be an API call)
      const booking = {
        id: Date.now(),
        serviceId: service.id,
        serviceName: service.name,
        consultantId: consultant.id || consultant.username,
        consultantName: consultant.fullName,
        seekerData: formData,
        advanceAmount,
        totalAmount: service.price,
        remainingAmount: service.price - advanceAmount,
        status: 'pending', // pending, accepted, completed, cancelled
        createdAt: new Date().toISOString(),
        type: 'service' // to distinguish from regular bookings
      };
      
      // Save to seeker's bookings
      const existingBookings = JSON.parse(localStorage.getItem('serviceBookings') || '[]');
      localStorage.setItem('serviceBookings', JSON.stringify([...existingBookings, booking]));
      
      // Save to consultant's received bookings
      const consultantBookings = JSON.parse(localStorage.getItem('consultantServiceBookings') || '[]');
      localStorage.setItem('consultantServiceBookings', JSON.stringify([...consultantBookings, booking]));
    }, 2000);
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
                      Advance: ₹{advanceAmount}
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
                      placeholder="+91 98765 43210"
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
                    <p>• Advance Payment: ₹{advanceAmount} (required for booking confirmation)</p>
                    <p>• Remaining Amount: ₹{service.price - advanceAmount} (paid directly to consultant)</p>
                    <p>• Booking will be confirmed after consultant approval</p>
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
                    <span className="text-muted-foreground">Advance Payment:</span>
                    <span className="font-medium text-brand-teal">₹{advanceAmount}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Remaining Amount:</span>
                    <span className="font-medium">₹{service.price - advanceAmount}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
                <h4 className="font-medium text-brand-teal mb-2">Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  For demo purposes, clicking "Pay Now" will simulate a successful payment.
                  In production, this would integrate with a real payment gateway.
                </p>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full bg-brand-teal hover:bg-brand-teal/90"
                disabled={loading}
              >
                {loading ? "Processing Payment..." : "Pay Now (₹" + advanceAmount + ")"}
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
                    <li>• Pay remaining amount directly to consultant</li>
                    <li>• Schedule your consultation session</li>
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
