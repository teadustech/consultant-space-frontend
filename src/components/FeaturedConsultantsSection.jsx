import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FiArrowRight, FiStar, FiDollarSign, FiUser } from "react-icons/fi";

export default function FeaturedConsultantsSection() {
  const navigate = useNavigate();
  const [featuredConsultants, setFeaturedConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedConsultants();
  }, []);

  const loadFeaturedConsultants = () => {
    try {
      const allProfiles = JSON.parse(localStorage.getItem('allConsultantProfiles') || '{}');
      const consultantList = Object.values(allProfiles).filter(profile => 
        profile.profileEnabled && profile.username && profile.services.length > 0
      );
      
      // Sort by number of services and take top 3
      const sorted = consultantList.sort((a, b) => b.services.length - a.services.length);
      setFeaturedConsultants(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinPrice = (services) => {
    if (!services || services.length === 0) return 0;
    return Math.min(...services.map(service => service.price));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-brand-red/5 to-brand-teal/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredConsultants.length === 0) {
    return null; // Don't show section if no consultants
  }

  return (
    <section className="py-16 bg-gradient-to-r from-brand-red/5 to-brand-teal/5" id="featured-consultants">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Expert Consultants
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover top professionals ready to help you succeed. 
            Browse their expertise and book consultations directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredConsultants.map((consultant) => (
            <Card key={consultant.username} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {consultant.profilePicture ? (
                      <img
                        src={consultant.profilePicture}
                        alt={`${consultant.fullName || consultant.username}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-red/20 border-2 border-border flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {consultant.fullName || consultant.username}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">
                      {consultant.tagline}
                    </p>
                    {consultant.domain && (
                      <Badge variant="secondary" className="text-xs">
                        {consultant.domain}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Bio Preview */}
                {consultant.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {consultant.bio}
                  </p>
                )}

                {/* Expertise */}
                {consultant.expertise && consultant.expertise.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {consultant.expertise.slice(0, 2).map((exp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {consultant.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{consultant.expertise.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Preview */}
                {consultant.services && consultant.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Services</p>
                    <div className="space-y-1">
                      {consultant.services.slice(0, 2).map((service) => (
                        <div key={service.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground truncate">{service.name}</span>
                          <span className="font-medium text-brand-teal">₹{service.price}</span>
                        </div>
                      ))}
                      {consultant.services.length > 2 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{consultant.services.length - 2} more services
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Starting Price */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-muted-foreground">Starting from:</span>
                  <span className="font-semibold text-brand-teal flex items-center gap-1">
                    <FiDollarSign className="h-3 w-3" />
                    ₹{getMinPrice(consultant.services)}
                  </span>
                </div>

                {/* View Profile Button */}
                <Button 
                  onClick={() => navigate(`/consultants/${consultant.username}`)}
                  className="w-full bg-brand-teal hover:bg-brand-teal/90"
                  size="sm"
                >
                  View Profile
                  <FiArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/consultants')}
            variant="outline"
            size="lg"
            className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
          >
            View All Consultants
            <FiArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
