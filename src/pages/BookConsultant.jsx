import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  CalendarDays,
  Clock3,
  Video,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { consultantService } from "../services/consultantService";
import { bookingService } from "../services/bookingService";

export default function BookConsultant() {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  
  const [consultant, setConsultant] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("consultation");
  const [sessionDuration, setSessionDuration] = useState(60);
  const [meetingPlatform, setMeetingPlatform] = useState("google_meet");
  const [description, setDescription] = useState("");
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadConsultant();
  }, [consultantId]);

  useEffect(() => {
    if (consultant) {
      loadAvailability();
    }
  }, [consultant, selectedMonth]);

  const loadConsultant = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get the token for authenticated requests
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      let consultantData;
      
      if (token && userType === 'seeker') {
        // Use authenticated endpoint for seekers
        consultantData = await consultantService.getConsultantProfile(consultantId);
      } else {
        // Use public endpoint for non-authenticated users
        consultantData = await consultantService.getPublicConsultantProfile(consultantId);
      }
      
      setConsultant(consultantData);
    } catch (error) {
      console.error('Error loading consultant:', error);
      setError(error.response?.data?.message || 'Failed to load consultant details');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    try {
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      
      const data = await bookingService.getConsultantAvailability(
        consultantId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      setAvailability(data.availability);
    } catch (error) {
      console.error('Load availability error:', error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time for your session");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      setSuccess("");

      const sessionDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      const bookingData = {
        consultantId,
        sessionType,
        sessionDuration,
        sessionDate: selectedDate, // Send just the date string (YYYY-MM-DD) to avoid timezone issues
        startTime: selectedTime,
        meetingPlatform,
        description
      };

      const result = await bookingService.createBooking(bookingData);
      
      setSuccess("Booking created successfully! You will receive a confirmation email shortly.");
      
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setSessionType("consultation");
      setSessionDuration(60);
      setMeetingPlatform("google_meet");
      setDescription("");

             // Redirect to booking confirmation after 2 seconds
       setTimeout(() => {
         navigate(`/booking-confirmation/${result.booking._id}`);
       }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const isSelected = dateString === selectedDate;
      
      // Check if date has availability
      const dayAvailability = availability.find(day => day.date === dateString);
      const hasAvailability = dayAvailability && dayAvailability.availableSlots.length > 0;
      
      // Check if date is in the past
      const isPast = currentDate < new Date().setHours(0, 0, 0, 0);

      days.push({
        date: dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        hasAvailability,
        isPast
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getAvailableTimesForDate = () => {
    if (!selectedDate) return [];
    
    const dayAvailability = availability.find(day => day.date === selectedDate);
    return dayAvailability ? dayAvailability.availableSlots : [];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const calculateTotalAmount = () => {
    if (!consultant) return 0;
    return Math.round((consultant.hourlyRate * sessionDuration) / 60);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading consultant details...</p>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Consultant Not Found</h2>
          <p className="text-muted-foreground mb-4">The consultant you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/find-consultants')}>
            Find Other Consultants
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
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Book Consultation
          </h1>
          <p className="text-muted-foreground">
            Schedule a session with {consultant.fullName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultant Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Consultant Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {consultant.profileImage ? (
                    <img 
                      src={consultant.profileImage} 
                      alt={consultant.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-brand-teal flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{consultant.fullName}</h3>
                    <p className="text-muted-foreground">{consultant.domain}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{consultant.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({consultant.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span><strong>Experience:</strong> {consultant.experience} years</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <Star className="h-4 w-4 text-yellow-500" />
                     <span><strong>Rating:</strong> {consultant.rating || 0} ({consultant.totalReviews || 0} reviews)</span>
                   </div>
                   {consultant.domain && (
                     <div className="flex items-center gap-2 text-sm">
                       <MapPin className="h-4 w-4 text-muted-foreground" />
                       <span><strong>Domain:</strong> {consultant.domain}</span>
                     </div>
                   )}
                 </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hourly Rate:</span>
                    <span className="text-lg font-bold text-brand-teal">
                      {formatCurrency(consultant.hourlyRate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">Experience:</span>
                    <span>{consultant.experience} years</span>
                  </div>
                </div>

                {consultant.bio && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">{consultant.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Your Session
                </CardTitle>
                <CardDescription>
                  Select a date and time that works for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>{success}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Calendar */}
                  <div>
                    <h3 className="font-medium mb-3">Select Date</h3>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prevMonth = new Date(selectedMonth);
                            prevMonth.setMonth(prevMonth.getMonth() - 1);
                            setSelectedMonth(prevMonth);
                          }}
                        >
                          ←
                        </Button>
                        <h4 className="font-medium">
                          {selectedMonth.toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextMonth = new Date(selectedMonth);
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            setSelectedMonth(nextMonth);
                          }}
                        >
                          →
                        </Button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => !day.isPast && day.hasAvailability && handleDateSelect(day.date)}
                            disabled={day.isPast || !day.hasAvailability}
                            className={`
                              p-2 text-sm rounded-md transition-colors
                              ${day.isSelected 
                                ? 'bg-brand-teal text-white' 
                                : day.isToday 
                                  ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal'
                                  : day.hasAvailability && !day.isPast
                                    ? 'hover:bg-muted cursor-pointer'
                                    : 'text-muted-foreground cursor-not-allowed'
                              }
                              ${!day.isCurrentMonth ? 'opacity-50' : ''}
                            `}
                          >
                            {day.day}
                            {day.hasAvailability && !day.isPast && (
                              <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-medium mb-3">Select Time</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {getAvailableTimesForDate().map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time)}
                            className={`
                              p-3 text-sm rounded-lg border transition-colors
                              ${selectedTime === time
                                ? 'bg-brand-teal text-white border-brand-teal'
                                : 'hover:bg-muted border-input'
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      {getAvailableTimesForDate().length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No available time slots for this date.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session Type</label>
                      <Select value={sessionType} onValueChange={setSessionType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="mentoring">Mentoring</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="coaching">Coaching</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Select value={sessionDuration.toString()} onValueChange={(value) => setSessionDuration(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Meeting Platform</label>
                      <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                        <Video className="h-4 w-4 text-brand-teal" />
                        <span className="text-sm font-medium">Google Meet</span>
                      </div>
                      <input type="hidden" value="google_meet" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Total Amount</label>
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="text-lg font-bold text-brand-teal">
                          {formatCurrency(calculateTotalAmount())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Description (Optional)</label>
                    <Textarea
                      placeholder="Describe what you'd like to discuss or any specific questions you have..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={bookingLoading || !selectedDate || !selectedTime}
                    className="w-full"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Session for {formatCurrency(calculateTotalAmount())}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 