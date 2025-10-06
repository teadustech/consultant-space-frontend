import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Star, Clock, DollarSign, User, Calendar, Briefcase } from "lucide-react";
import { consultantService } from "../services/consultantService";

export default function ConsultantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultantProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the token for authenticated requests
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        
        let profileData;
        
        if (token && userType === 'seeker') {
          // Use authenticated endpoint for seekers
          profileData = await consultantService.getConsultantProfile(id);
        } else {
          // Use public endpoint for non-authenticated users
          profileData = await consultantService.getPublicConsultantProfile(id);
        }
        
        setConsultant(profileData);
      } catch (error) {
        console.error('Error fetching consultant profile:', error);
        setError(error.response?.data?.message || 'Failed to load consultant profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConsultantProfile();
    }
  }, [id]);

  const handleBookConsultation = () => {
    navigate(`/book/${id}`);
  };

  const handleBackToSearch = () => {
    navigate('/search-consultants');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading consultant profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSearch}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleBackToSearch}>
                  Back to Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return null;
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
            onClick={handleBackToSearch}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Consultant Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{consultant.fullName}</h1>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-medium">
                          {consultant.domain}
                        </span>
                        {consultant.isVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{consultant.rating || 0} ({consultant.totalReviews || 0} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{consultant.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{consultant.hourlyRate}/hour</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={handleBookConsultation}
                        className="bg-brand-teal hover:bg-brand-teal/90"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {consultant.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {consultant.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Expertise */}
              {consultant.expertise && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {consultant.expertise}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {consultant.skills && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skills & Technologies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {consultant.skills}
                    </p>
                  </CardContent>
                </Card>
              )}

              
            </div>

                         {/* Sidebar */}
             <div className="space-y-6">
               {/* Professional Summary */}
               <Card>
                 <CardHeader>
                   <CardTitle>Professional Summary</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="flex items-center gap-2 text-sm">
                     <Briefcase className="h-4 w-4 text-muted-foreground" />
                     <span className="text-muted-foreground">
                       <strong>Domain:</strong> {consultant.domain}
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span className="text-muted-foreground">
                       <strong>Experience:</strong> {consultant.experience} years
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <DollarSign className="h-4 w-4 text-muted-foreground" />
                     <span className="text-muted-foreground">
                       <strong>Rate:</strong> ₹{consultant.hourlyRate}/hour
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <Star className="h-4 w-4 text-yellow-500" />
                     <span className="text-muted-foreground">
                       <strong>Rating:</strong> {consultant.rating || 0} ({consultant.totalReviews || 0} reviews)
                     </span>
                   </div>
                 </CardContent>
               </Card>

              {/* Session Types */}
              {consultant.sessionTypes && consultant.sessionTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Session Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {consultant.sessionTypes.map((type, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Meeting Platforms */}
              {consultant.meetingPlatforms && consultant.meetingPlatforms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {consultant.meetingPlatforms.map((platform, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {platform.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${consultant.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        {consultant.isAvailable ? 'Available for consultations' : 'Currently unavailable'}
                      </span>
                    </div>
                    
                    {consultant.isAvailable && consultant.workingHours && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Working Hours:</h4>
                        <div className="space-y-1">
                          {Object.entries(consultant.workingHours).map(([day, hours]) => {
                            if (hours.available) {
                              return (
                                <div key={day} className="flex justify-between text-xs">
                                  <span className="capitalize">{day}:</span>
                                  <span>{hours.start} - {hours.end}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 