import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceBookingModal from "../components/ServiceBookingModal";
import { 
  FiStar, 
  FiClock, 
  FiDollarSign, 
  FiCheckCircle,
  FiAward,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiBookOpen
} from "react-icons/fi";

export default function ConsultantPublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    // TODO: Fetch consultant data from API based on username
    // For now, using mock data from localStorage
    const fetchConsultantData = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Try to get from localStorage (in real app, this would be an API call)
        const allProfiles = JSON.parse(localStorage.getItem('allConsultantProfiles') || '{}');
        console.log('All profiles from localStorage:', allProfiles);
        console.log('Looking for username:', username);
        const profileData = allProfiles[username];
        console.log('Found profile data:', profileData);
        
        if (profileData && profileData.profileEnabled) {
          console.log('Profile found and enabled:', profileData);
          setConsultant(profileData);
        } else {
          // If no profile found, show error message
          console.log('Profile not found or not enabled:', profileData);
          if (profileData) {
            console.log('Profile exists but profileEnabled is:', profileData.profileEnabled);
          }
          setConsultant(null);
        }
        setLoading(false);
      }, 1000);
    };

    if (username) {
      fetchConsultantData();
    }
  }, [username, navigate]);

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    // Show success message or redirect
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading consultant profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Consultant Profile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The consultant profile for "{username}" doesn't exist or is not enabled.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              This could happen if:
            </p>
            <ul className="text-sm text-muted-foreground mb-6 text-left max-w-md mx-auto">
              <li>• The username "{username}" is incorrect</li>
              <li>• The consultant hasn't created their profile yet</li>
              <li>• The profile is disabled</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/consultants')}>
                Browse All Consultants
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Profile Image */}
              <div className="text-center md:text-left">
                {consultant.profilePicture ? (
                  <img
                    src={consultant.profilePicture}
                    alt={`${consultant.fullName || 'Consultant'}'s profile`}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto md:mx-0 mb-6"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-brand-teal to-brand-red mx-auto md:mx-0 mb-6 flex items-center justify-center">
                    <FiUser className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="md:col-span-2 text-center md:text-left">
                <Badge variant="secondary" className="mb-4">
                  {consultant.domain || "Expert Consultant"}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {consultant.fullName || "Consultant Name"}
                </h1>
                {consultant.tagline && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {consultant.tagline}
                  </p>
                )}
                {consultant.bio && (
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    {consultant.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Services Section */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FiBookOpen className="h-8 w-8 text-brand-teal" />
                  Services & Pricing
                </h2>
                <div className="space-y-4">
                  {consultant.services && consultant.services.length > 0 ? (
                    consultant.services.map((service) => (
                      <Card key={service.id} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-foreground mb-2">
                                {service.name}
                              </h3>
                              {service.description && (
                                <p className="text-muted-foreground mb-3">
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
                                  ₹{service.price}
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleBookService(service)}
                              className="bg-brand-teal hover:bg-brand-teal/90"
                            >
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No services available at the moment.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>

              {/* Qualifications & Experience */}
              {(consultant.qualifications || consultant.experience) && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <FiAward className="h-8 w-8 text-brand-teal" />
                    Qualifications & Experience
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {consultant.qualifications && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FiAward className="h-5 w-5 text-brand-teal" />
                            Qualifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {consultant.qualifications}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {consultant.experience && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FiBriefcase className="h-5 w-5 text-brand-teal" />
                            Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {consultant.experience}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </section>
              )}

              {/* Areas of Expertise */}
              {consultant.expertise && consultant.expertise.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {consultant.expertise.map((expertise, index) => (
                      <Badge key={index} variant="outline" className="text-base px-4 py-2">
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-medium">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">5+ years</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Booking */}
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ready to work with this consultant? Book a service to get started.
                  </p>
                  <Button 
                    onClick={() => consultant.services && consultant.services.length > 0 && handleBookService(consultant.services[0])}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    disabled={!consultant.services || consultant.services.length === 0}
                  >
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card className="border-brand-teal/20 bg-brand-teal/5">
                <CardHeader>
                  <CardTitle className="text-brand-teal text-sm">Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-3 w-3 text-brand-teal mt-0.5 flex-shrink-0" />
                      Advance payment required for booking confirmation
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-3 w-3 text-brand-teal mt-0.5 flex-shrink-0" />
                      Remaining payment directly to consultant
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-3 w-3 text-brand-teal mt-0.5 flex-shrink-0" />
                      Booking confirmed after consultant approval
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Service Booking Modal */}
      {showBookingModal && selectedService && (
        <ServiceBookingModal
          service={selectedService}
          consultant={consultant}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      <Footer />
    </>
  );
}
