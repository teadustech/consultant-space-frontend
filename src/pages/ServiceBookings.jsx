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
  FiPhone
} from "react-icons/fi";

export default function ServiceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Load service bookings from localStorage
    const loadBookings = () => {
      const allBookings = JSON.parse(localStorage.getItem('consultantServiceBookings') || '[]');
      // Filter bookings for current consultant (in real app, this would be by consultant ID)
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const consultantBookings = allBookings.filter(booking => 
        booking.consultantId === userData.id || booking.consultantName === userData.fullName
      );
      setBookings(consultantBookings);
      setLoading(false);
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = (bookingId, newStatus) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    );

    // Update in localStorage
    const allBookings = JSON.parse(localStorage.getItem('consultantServiceBookings') || '[]');
    const updatedBookings = allBookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    );
    localStorage.setItem('consultantServiceBookings', JSON.stringify(updatedBookings));

    // Also update in seeker's bookings
    const seekerBookings = JSON.parse(localStorage.getItem('serviceBookings') || '[]');
    const updatedSeekerBookings = seekerBookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    );
    localStorage.setItem('serviceBookings', JSON.stringify(updatedSeekerBookings));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Pending", color: "text-yellow-600" },
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading service bookings...</p>
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
              Service Bookings
            </h1>
            <p className="text-muted-foreground">
              Manage service bookings from seekers
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
                      ? "No service bookings received yet." 
                      : `No ${activeFilter} bookings found.`
                    }
                  </p>
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
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FiUser className="h-4 w-4" />
                            {booking.seekerData.name}
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
                      {/* Seeker Information */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Seeker Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FiUser className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.seekerData.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMail className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.seekerData.email}</span>
                          </div>
                          {booking.seekerData.phone && (
                            <div className="flex items-center gap-2">
                              <FiPhone className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.seekerData.phone}</span>
                            </div>
                          )}
                          {booking.seekerData.preferredDate && (
                            <div className="flex items-center gap-2">
                              <FiCalendar className="h-4 w-4 text-muted-foreground" />
                              <span>Preferred: {formatDate(booking.seekerData.preferredDate)}</span>
                            </div>
                          )}
                          {booking.seekerData.preferredTime && (
                            <div className="flex items-center gap-2">
                              <FiClock className="h-4 w-4 text-muted-foreground" />
                              <span>Time: {booking.seekerData.preferredTime}</span>
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

                        {booking.seekerData.message && (
                          <div className="mb-4">
                            <h5 className="font-medium text-foreground mb-2">Message</h5>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                              {booking.seekerData.message}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <FiCheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                variant="destructive"
                                size="sm"
                              >
                                <FiX className="h-4 w-4 mr-2" />
                                Decline
                              </Button>
                            </>
                          )}
                          
                          {booking.status === 'accepted' && (
                            <Button
                              onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <FiCheckCircle className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
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
