import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Calendar,
  Clock,
  User,
  Star,
  MessageSquare,
  Video,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from "lucide-react";
import { bookingService } from "../services/bookingService";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
    sortBy: "sessionDate",
    sortOrder: "desc"
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');

    if (!token || !storedUserData) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUserData);
    setUserData(userData);
    
    // Debug: Log user data
    console.log('User Data:', userData);
    console.log('User Type:', userData.userType);
    
    loadBookings();
  }, [navigate, filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings(filters);
      setBookings(data.bookings);
      setPagination(data.pagination);
      
      // Debug: Log booking data
      console.log('Bookings loaded:', data.bookings);
      data.bookings.forEach((booking, index) => {
        console.log(`Booking ${index + 1}:`, {
          id: booking._id,
          status: booking.status,
          userType: userData?.userType,
          sessionDate: booking.sessionDate,
          startTime: booking.startTime,
          sessionDateType: typeof booking.sessionDate,
          sessionDateInstance: booking.sessionDate instanceof Date,
          canCancel: bookingService.canCancelBooking(booking)
        });
      });
    } catch (error) {
      setError(error.message);
      if (error.message.includes('401') || error.message.includes('403')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleStatusUpdate = async (bookingId, newStatus, reason = '') => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus, reason);
      loadBookings(); // Reload data
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelBooking = async (booking) => {
    // Debug logging
    console.log('Cancel booking attempt:', {
      bookingId: booking._id,
      status: booking.status,
      sessionDate: booking.sessionDate,
      startTime: booking.startTime,
      canCancel: bookingService.canCancelBooking(booking)
    });
    
    const reason = window.prompt('Please provide a reason for cancellation (optional):');
    if (reason !== null) { // User didn't cancel the prompt
      try {
        await handleStatusUpdate(booking._id, 'cancelled', reason);
      } catch (error) {
        console.error('Cancel booking error:', error);
        setError(error.message);
      }
    }
  };

  const handleAddReview = async (booking) => {
    const rating = window.prompt('Rate your experience (1-5 stars):');
    const review = window.prompt('Write a review (optional):');
    
    if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
      try {
        await bookingService.addReview(booking._id, parseInt(rating), review || '');
        loadBookings(); // Reload data
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleViewDetails = (booking) => {
    // For now, show booking details in an alert
    // In the future, this could navigate to a dedicated booking details page
    const details = `
Booking Details:
- ID: ${booking.bookingId}
- Date: ${formatDate(booking.sessionDate)}
- Time: ${formatTime(booking.startTime, booking.endTime)}
- Consultant: ${booking.consultant.fullName}
- Platform: ${getPlatformLabel(booking.meetingPlatform)}
- Amount: ${formatCurrency(booking.amount)}
- Status: ${bookingService.getStatusLabel(booking.status)}
- Description: ${booking.description || 'No description provided'}
    `;
    alert(details);
  };

  const handleReschedule = (booking) => {
    // For now, show a message that rescheduling is not yet implemented
    alert('Rescheduling functionality will be implemented soon. Please contact support for immediate rescheduling needs.');
  };

  const formatDate = (dateString) => {
    // Handle timezone issues by creating a consistent date object
    const date = new Date(dateString);
    
    // Use local date formatting to avoid timezone shifts
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC' // Force UTC to avoid timezone conversion issues
    });
  };

  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPlatformIcon = (platform) => {
    return <Video className="h-4 w-4" />;
  };

  const getPlatformLabel = (platform) => {
    return 'Google Meet';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your consultation sessions and appointments
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sessionDate">Session Date</SelectItem>
                    <SelectItem value="createdAt">Booking Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bookings ({pagination.totalCount || 0})
              </span>
              <Button onClick={loadBookings} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              View and manage all your consultation bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Session Details</TableHead>
                  <TableHead>Consultant</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Meeting Link</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-mono text-sm">
                      {booking.bookingId}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{formatDate(booking.sessionDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatTime(booking.startTime, booking.endTime)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.sessionType} • {booking.sessionDuration} min
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {booking.consultant.profileImage ? (
                          <img 
                            src={booking.consultant.profileImage} 
                            alt={booking.consultant.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{booking.consultant.fullName}</div>
                          <div className="text-sm text-muted-foreground">{booking.consultant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(booking.meetingPlatform)}
                        <span className="text-sm">{getPlatformLabel(booking.meetingPlatform)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.meetingLink ? (
                        <a 
                          href={booking.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-teal hover:underline text-sm font-medium"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(booking.amount)}</div>
                      {booking.paymentStatus !== 'paid' && (
                        <Badge variant="warning" className="text-xs">
                          {booking.paymentStatus}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={bookingService.getStatusColor(booking.status)}>
                        {bookingService.getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Always show View Details button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          title="View Booking Details"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* Status-specific actions */}
                        {booking.status === 'pending' && userData?.userType === 'consultant' && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                              title="Approve Booking"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled', 'Declined by consultant')}
                              title="Reject Booking"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && userData?.userType === 'consultant' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                            title="Mark as Completed"
                          >
                            Complete
                          </Button>
                        )}
                        
                        {booking.status === 'completed' && userData?.userType === 'seeker' && !booking.rating && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddReview(booking)}
                            title="Add Review"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Show cancel button for pending and confirmed bookings */}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && bookingService.canCancelBooking(booking) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                            title="Cancel Booking"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Debug info for cancel button */}
                        {console.log('Cancel button debug:', {
                          bookingId: booking._id,
                          status: booking.status,
                          userType: userData?.userType,
                          canCancel: bookingService.canCancelBooking(booking),
                          showCancel: (booking.status === 'pending' || booking.status === 'confirmed') && bookingService.canCancelBooking(booking)
                        })}
                        
                        {/* Show reschedule button for pending and confirmed bookings */}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(booking)}
                            title="Reschedule Booking"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No bookings found</p>
                        <Button onClick={() => navigate('/find-consultants')}>
                          Find Consultants
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} bookings
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
} 