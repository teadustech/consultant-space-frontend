import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, Star, RefreshCw } from "lucide-react";
import { bookingService } from "../services/bookingService";

export default function ViewSchedule() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    cancelledSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalHours: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const storedUserData = localStorage.getItem('userData');

    if (!token || userType !== 'consultant' || !storedUserData) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      loadBookings();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      console.log('📋 Loaded bookings:', data.bookings);
      setBookings(data.bookings);
      calculateStats(data.bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const totalSessions = bookings.length;
    const completedSessions = bookings.filter(b => b.status === 'completed').length;
    const upcomingSessions = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
    const cancelledSessions = bookings.filter(b => b.status === 'cancelled').length;
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.amount, 0);
    const totalHours = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.sessionDuration / 60), 0);
    
    // Calculate average rating
    const ratedBookings = bookings.filter(b => b.rating);
    const averageRating = ratedBookings.length > 0 
      ? ratedBookings.reduce((sum, b) => sum + b.rating, 0) / ratedBookings.length 
      : 0;

    setStats({
      totalSessions,
      completedSessions,
      upcomingSessions,
      cancelledSessions,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalHours: Math.round(totalHours * 10) / 10
    });
  };

  const handleStatusUpdate = async (bookingId, newStatus, reason = '') => {
    try {
      console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`);
      await bookingService.updateBookingStatus(bookingId, newStatus, reason);
      console.log(`✅ Booking status updated successfully`);
      loadBookings(); // Reload data
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      setError(error.message);
    }
  };

  const handleApproveBooking = async (booking) => {
    await handleStatusUpdate(booking._id, 'confirmed');
  };

  const handleRejectBooking = async (booking) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) { // User didn't cancel the prompt
      await handleStatusUpdate(booking._id, 'cancelled', reason || 'Declined by consultant');
    }
  };

  const handleCompleteBooking = async (booking) => {
    await handleStatusUpdate(booking._id, 'completed');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading schedule...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Schedule</h1>
            <p className="text-muted-foreground">View and manage your consultation sessions</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}/5</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upcoming')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Upcoming ({getFilteredBookings().length})
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'default' : 'outline'}
            onClick={() => setActiveTab('completed')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Completed ({getFilteredBookings().length})
          </Button>
          <Button
            variant={activeTab === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cancelled')}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancelled ({getFilteredBookings().length})
          </Button>
          <Button
            variant="outline"
            onClick={loadBookings}
            className="ml-auto"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {getFilteredBookings().length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No {activeTab} sessions</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'upcoming' && "You don't have any upcoming sessions scheduled."}
                  {activeTab === 'completed' && "You haven't completed any sessions yet."}
                  {activeTab === 'cancelled' && "You don't have any cancelled sessions."}
                </p>
              </CardContent>
            </Card>
          ) : (
            getFilteredBookings().map((booking) => (
              <Card key={booking._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{booking.seeker.fullName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {bookingService.getStatusLabel(booking.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(booking.sessionDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatTime(booking.startTime, booking.endTime)} ({booking.sessionDuration} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">₹{booking.amount}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Topic:</strong> {booking.description || `${booking.sessionType} session`}
                      </p>
                      
                      {booking.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Rating:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < booking.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {booking.cancellationReason && (
                        <p className="text-sm text-red-600 mt-2">
                          <strong>Reason:</strong> {booking.cancellationReason}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      
                      {/* Action Buttons */}
                      {booking.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          {console.log(`🎯 Showing approval buttons for booking ${booking._id} with status: ${booking.status}`)}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveBooking(booking)}
                            title="Approve Booking"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectBooking(booking)}
                            title="Reject Booking"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCompleteBooking(booking)}
                          title="Mark as Completed"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 