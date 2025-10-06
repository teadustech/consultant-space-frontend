import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiDollarSign,
  FiMessageSquare,
  FiCheckCircle,
  FiX,
  FiMail,
  FiPhone,
  FiCreditCard
} from "react-icons/fi";

export default function SeekerServiceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Load service bookings from localStorage
    const loadBookings = () => {
      const allBookings = JSON.parse(localStorage.getItem('serviceBookings') || '[]');
      // Filter bookings for current seeker (in real app, this would be by seeker ID)
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const seekerBookings = allBookings.filter(booking => 
        booking.seekerData.email === userData.email
      );
      setBookings(seekerBookings);
      setLoading(false);
    };

    loadBookings();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Pending Approval", color: "text-yellow-600" },
      accepted: { variant: "default", text: "Accepted", color: "text-green-600" },
      completed: { variant: "default", text: "Completed", color: "text-blue-600" },
      cancelled: { variant: "destructive", text: "Cancelled", color: "text-red-600" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (booking) => {
    if (booking.status === 'cancelled') {
      return <Badge variant="outline" className="text-red-600">Refund Pending</Badge>;
    }
    
    if (booking.status === 'completed') {
      return <Badge variant="outline" className="text-green-600">Payment Complete</Badge>;
    }
    
    if (booking.status === 'accepted') {
      return <Badge variant="outline" className="text-orange-600">Pay Remaining</Badge>;
    }
    
    return <Badge variant="outline" className="text-blue-600">Advance Paid</Badge>;
  };

  const getFilteredBookings = () => {
    if (activeFilter === 'all') return bookings;
    return bookings.filter(booking => booking.status === activeFilter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      // Update in localStorage
      const allBookings = JSON.parse(localStorage.getItem('serviceBookings') || '[]');
      const updatedBookings = allBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      localStorage.setItem('serviceBookings', JSON.stringify(updatedBookings));

      // Also update in consultant's bookings
      const consultantBookings = JSON.parse(localStorage.getItem('consultantServiceBookings') || '[]');
      const updatedConsultantBookings = consultantBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      localStorage.setItem('consultantServiceBookings', JSON.stringify(updatedConsultantBookings));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your service bookings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Service Bookings
            </h1>
            <p className="text-muted-foreground">
              Track your service bookings and payment status
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {bookings.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'accepted').length}
                </div>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="capitalize"
              >
                {filter === 'all' ? 'All' : filter}
              </Button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {getFilteredBookings().length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {activeFilter === 'all' 
                      ? "You haven't made any service bookings yet." 
                      : `No ${activeFilter} bookings found.`
                    }
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90"
                  >
                    Find Consultants
                  </Button>
                </CardContent>
              </Card>
            ) : (
              getFilteredBookings().map((booking) => (
                <Card key={booking.id} className="border shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {booking.serviceName}
                          </h3>
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FiUser className="h-4 w-4" />
                            {booking.consultantName}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar className="h-4 w-4" />
                            {formatDate(booking.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="h-4 w-4" />
                            ₹{booking.totalAmount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Service & Consultant Information */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Service Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FiUser className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Consultant:</strong> {booking.consultantName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCalendar className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Booked:</strong> {formatDate(booking.createdAt)}</span>
                          </div>
                          {booking.seekerData.preferredDate && (
                            <div className="flex items-center gap-2">
                              <FiCalendar className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Preferred Date:</strong> {formatDate(booking.seekerData.preferredDate)}</span>
                            </div>
                          )}
                          {booking.seekerData.preferredTime && (
                            <div className="flex items-center gap-2">
                              <FiClock className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Preferred Time:</strong> {booking.seekerData.preferredTime}</span>
                            </div>
                          )}
                          {booking.seekerData.message && (
                            <div className="mt-3">
                              <span className="font-medium">Your Message:</span>
                              <p className="text-muted-foreground mt-1 bg-muted/30 p-2 rounded">
                                {booking.seekerData.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment & Actions */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Payment Details</h4>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span className="font-medium">₹{booking.totalAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Advance Paid:</span>
                            <span className="font-medium text-green-600">₹{booking.advanceAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remaining:</span>
                            <span className="font-medium">₹{booking.remainingAmount}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {booking.status === 'pending' && (
                            <Button
                              onClick={() => handleCancelBooking(booking.id)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <FiX className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}
                          
                          {booking.status === 'accepted' && (
                            <div className="space-y-2">
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <p className="text-sm text-orange-800">
                                  <strong>Next Step:</strong> Pay the remaining amount (₹{booking.remainingAmount}) directly to {booking.consultantName} to schedule your session.
                                </p>
                              </div>
                              <Button
                                onClick={() => handleCancelBooking(booking.id)}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <FiX className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </Button>
                            </div>
                          )}

                          {booking.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">
                                <strong>Session Completed!</strong> Thank you for using our platform.
                              </p>
                            </div>
                          )}

                          {booking.status === 'cancelled' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800">
                                <strong>Booking Cancelled.</strong> Your advance payment will be refunded within 5-7 business days.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
