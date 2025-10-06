import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { consultantService } from "../services/consultantService";

const daysOfWeek = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
];

const timeSlots = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

export default function ManageAvailability() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '17:00', available: true },
    tuesday: { start: '09:00', end: '17:00', available: true },
    wednesday: { start: '09:00', end: '17:00', available: true },
    thursday: { start: '09:00', end: '17:00', available: true },
    friday: { start: '09:00', end: '17:00', available: true },
    saturday: { start: '09:00', end: '17:00', available: false },
    sunday: { start: '09:00', end: '17:00', available: false }
  });

  const [bookingSettings, setBookingSettings] = useState({
    minBookingNotice: 2, // hours
    maxBookingAdvance: 30, // days
    isAvailable: true
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const storedUserData = localStorage.getItem('userData');

    if (!token || userType !== 'consultant' || !storedUserData) {
      navigate('/login');
      return;
    }

    setUserData(JSON.parse(storedUserData));
    loadConsultantData();
  }, [navigate]);

  const loadConsultantData = async () => {
    try {
      setLoading(true);
      const consultantData = await consultantService.getMyProfile();
      
      if (consultantData.workingHours) {
        setAvailability(consultantData.workingHours);
      }
      
      if (consultantData.minBookingNotice !== undefined) {
        setBookingSettings(prev => ({
          ...prev,
          minBookingNotice: consultantData.minBookingNotice
        }));
      }
      
      if (consultantData.maxBookingAdvance !== undefined) {
        setBookingSettings(prev => ({
          ...prev,
          maxBookingAdvance: consultantData.maxBookingAdvance
        }));
      }
      
      if (consultantData.isAvailable !== undefined) {
        setBookingSettings(prev => ({
          ...prev,
          isAvailable: consultantData.isAvailable
        }));
      }
    } catch (error) {
      console.error('Error loading consultant data:', error);
      setError('Failed to load your availability settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleBookingSettingChange = (field, value) => {
    setBookingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateTimeRange = (start, end) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return startTime < endTime;
  };

  const validateForm = () => {
    // Check if at least one day is available
    const hasAvailableDay = Object.values(availability).some(day => day.available);
    if (!hasAvailableDay) {
      setError('At least one day must be available for bookings');
      return false;
    }

    // Validate time ranges for available days
    for (const [day, settings] of Object.entries(availability)) {
      if (settings.available) {
        if (!validateTimeRange(settings.start, settings.end)) {
          setError(`${day.charAt(0).toUpperCase() + day.slice(1)}: End time must be after start time`);
          return false;
        }
      }
    }

    // Validate booking settings
    if (bookingSettings.minBookingNotice < 0 || bookingSettings.minBookingNotice > 168) {
      setError('Minimum booking notice must be between 0 and 168 hours');
      return false;
    }

    if (bookingSettings.maxBookingAdvance < 1 || bookingSettings.maxBookingAdvance > 365) {
      setError('Maximum booking advance must be between 1 and 365 days');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = {
        workingHours: availability,
        minBookingNotice: bookingSettings.minBookingNotice,
        maxBookingAdvance: bookingSettings.maxBookingAdvance,
        isAvailable: bookingSettings.isAvailable
      };

      await consultantService.updateProfile(updateData);
      
      setSuccess("Availability settings updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      
    } catch (error) {
      console.error('Error updating availability:', error);
      setError(error.message || 'Failed to update availability settings');
    } finally {
      setSaving(false);
    }
  };

  const getAvailableHours = (day) => {
    const settings = availability[day];
    if (!settings.available) return 0;
    
    const start = new Date(`2000-01-01T${settings.start}`);
    const end = new Date(`2000-01-01T${settings.end}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  };

  const getTotalAvailableHours = () => {
    return daysOfWeek.reduce((total, day) => {
      return total + getAvailableHours(day.key);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manage Availability
            </h1>
            <p className="text-muted-foreground">
              Set your working hours and booking preferences
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Availability Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Overall Availability
                </CardTitle>
                <CardDescription>
                  Control whether you're accepting new bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Accept New Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      When disabled, seekers won't be able to book new sessions
                    </p>
                  </div>
                  <Switch
                    checked={bookingSettings.isAvailable}
                    onCheckedChange={(checked) => handleBookingSettingChange('isAvailable', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </CardTitle>
                <CardDescription>
                  Set your availability for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={availability[day.key].available}
                            onCheckedChange={() => handleDayToggle(day.key)}
                          />
                          <Label className="text-base font-medium">{day.label}</Label>
                          {availability[day.key].available && (
                            <Badge variant="secondary">
                              {getAvailableHours(day.key)}h available
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {availability[day.key].available && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`${day.key}-start`}>Start Time</Label>
                            <select
                              id={`${day.key}-start`}
                              value={availability[day.key].start}
                              onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                              className="w-full mt-1 p-2 border rounded-md"
                            >
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor={`${day.key}-end`}>End Time</Label>
                            <select
                              id={`${day.key}-end`}
                              value={availability[day.key].end}
                              onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                              className="w-full mt-1 p-2 border rounded-md"
                            >
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    <span>Total available hours per week: <strong>{getTotalAvailableHours()} hours</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Preferences
                </CardTitle>
                <CardDescription>
                  Configure how far in advance seekers can book sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="minBookingNotice">Minimum Booking Notice (hours)</Label>
                    <Input
                      id="minBookingNotice"
                      type="number"
                      min="0"
                      max="168"
                      value={bookingSettings.minBookingNotice}
                      onChange={(e) => handleBookingSettingChange('minBookingNotice', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      How many hours in advance must bookings be made
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="maxBookingAdvance">Maximum Booking Advance (days)</Label>
                    <Input
                      id="maxBookingAdvance"
                      type="number"
                      min="1"
                      max="365"
                      value={bookingSettings.maxBookingAdvance}
                      onChange={(e) => handleBookingSettingChange('maxBookingAdvance', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      How many days in advance can bookings be made
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Availability Preview</CardTitle>
                <CardDescription>
                  How your availability will appear to seekers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{day.short}</span>
                        {availability[day.key].available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {availability[day.key].available ? (
                        <p className="text-sm text-muted-foreground">
                          {availability[day.key].start} - {availability[day.key].end}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not available</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
