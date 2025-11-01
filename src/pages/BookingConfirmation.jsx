import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Mail,
  Phone as PhoneIcon,
  Download,
  Share2,
  ArrowLeft,
  Star,
  AlertCircle,
  Eye,
  CreditCard
} from "lucide-react";
import { bookingService } from "../services/bookingService";
import PaymentModal from "../components/PaymentModal";

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data.booking);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    return <Video className="h-5 w-5" />;
  };

  const getPlatformLabel = (platform) => {
    return 'Google Meet';
  };

  const getSessionTypeLabel = (type) => {
    switch (type) {
      case 'consultation': return 'Consultation';
      case 'mentoring': return 'Mentoring';
      case 'review': return 'Review';
      case 'coaching': return 'Coaching';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const handleDownloadCalendar = () => {
    // Create calendar event data
    const event = {
      title: `${getSessionTypeLabel(booking.sessionType)} with ${booking.consultant.fullName}`,
      description: booking.description || `Session with ${booking.consultant.fullName}`,
      location: getPlatformLabel(booking.meetingPlatform),
      startTime: new Date(booking.sessionDate + 'T' + booking.startTime),
      endTime: new Date(booking.sessionDate + 'T' + booking.endTime)
    };

    // Generate ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Consultant Space//Booking Confirmation//EN',
      'BEGIN:VEVENT',
      `UID:${booking.bookingId}@consultantspace.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${event.startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${event.endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.bookingId}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShareBooking = () => {
    const shareData = {
      title: 'Consultation Booking Confirmed',
      text: `I have a ${getSessionTypeLabel(booking.sessionType)} session with ${booking.consultant.fullName} on ${formatDate(booking.sessionDate)} at ${booking.startTime}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
      alert('Booking details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The booking you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-bookings')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Bookings
          </Button>
          
          <div className="text-center">
            {booking.status === 'pending' ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Booking Submitted!
                </h1>
                <p className="text-muted-foreground">
                  Your booking request has been sent to the consultant for approval
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-muted-foreground">
                  Your consultation session has been successfully scheduled
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Session Type</label>
                    <p className="font-medium">{getSessionTypeLabel(booking.sessionType)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="font-medium">{booking.sessionDuration} minutes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="font-medium">{formatDate(booking.sessionDate)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Time</label>
                    <p className="font-medium">{formatTime(booking.startTime, booking.endTime)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Platform</label>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(booking.meetingPlatform)}
                      <span className="font-medium">{getPlatformLabel(booking.meetingPlatform)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="font-medium text-lg text-brand-teal">{formatCurrency(booking.amount)}</p>
                  </div>
                </div>

                {/* Description */}
                {booking.description && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Session Description</label>
                    <p className="text-sm bg-muted p-3 rounded-lg">{booking.description}</p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Status:</label>
                  <Badge variant={bookingService.getStatusColor(booking.status)}>
                    {bookingService.getStatusLabel(booking.status)}
                  </Badge>
                </div>

                {/* Meeting Link */}
                {booking.meetingLink && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Meeting Link</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Video className="h-4 w-4 text-brand-teal" />
                      <a 
                        href={booking.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-teal hover:underline font-medium"
                      >
                        Join Google Meet
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the link above to join your session at the scheduled time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consultant Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Consultant Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  {booking.consultant.profileImage ? (
                    <img 
                      src={booking.consultant.profileImage} 
                      alt={booking.consultant.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-brand-teal flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.consultant.fullName}</h3>
                      <p className="text-muted-foreground">{booking.consultant.email}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.consultant.email}</span>
                      </div>
                      
                      {booking.consultant.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{booking.consultant.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Next Steps */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleDownloadCalendar} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                
                <Button 
                  onClick={handleShareBooking} 
                  variant="outline" 
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Booking
                </Button>
                
                <Button 
                  onClick={() => navigate('/my-bookings')} 
                  variant="outline" 
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View My Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Confirmation Email</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation email with all the details
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Consultant Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      The consultant will review and confirm your booking
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Meeting Link</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive the meeting link 24 hours before the session
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Join Session</h4>
                    <p className="text-sm text-muted-foreground">
                      Join the session at the scheduled time and enjoy your consultation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Please join the session 5 minutes before the scheduled time
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Cancellations must be made at least 24 hours before the session
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    This is a prepaid service - payment is required before the session
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Required Notification */}
            {booking.status === 'pending' && booking.paymentStatus === 'pending' && (
              <Card className="mt-6 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <CreditCard className="h-5 w-5" />
                    Payment Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-orange-800">
                    <p className="text-sm">
                      Your booking with <strong>{booking.consultant.fullName}</strong> is ready! Complete payment to confirm your session.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">What happens next?</p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Complete payment to confirm your booking</li>
                        <li>• Google Meet link will be generated after payment</li>
                        <li>• Confirmation email will be sent with meeting details</li>
                        <li>• Your session will be confirmed immediately after payment</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/my-bookings')}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            View All Bookings
          </Button>
          
          {booking?.paymentStatus === 'pending' && booking?.status === 'pending' && (
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now to Confirm Booking
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/find-consultants')}
            className="flex-1 sm:flex-none"
          >
            Book Another Session
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={booking}
        consultant={booking?.consultant}
        onPaymentSuccess={(result) => {
          console.log('Payment successful:', result);
          setShowPaymentModal(false);
          // Reload booking details to show updated status
          loadBookingDetails();
          // Show success message
          alert('Payment successful! Your booking is now confirmed.');
        }}
        onPaymentFailure={(error) => {
          console.error('Payment failed:', error);
          // Error is already handled in the modal
        }}
      />
    </div>
  );
} 