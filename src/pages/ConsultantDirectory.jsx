import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  FiSearch, 
  FiMapPin, 
  FiDollarSign, 
  FiStar, 
  FiFilter,
  FiX,
  FiUser
} from "react-icons/fi";

export default function ConsultantDirectory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const domains = ["Software", "Finance", "Law", "Admin", "Marketing", "HR", "Other"];

  useEffect(() => {
    loadConsultants();
    
    // Handle URL search parameters
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    filterConsultants();
  }, [searchQuery, selectedDomain, priceRange, consultants]);

  const loadConsultants = () => {
    try {
      const allProfiles = JSON.parse(localStorage.getItem('allConsultantProfiles') || '{}');
      const consultantList = Object.values(allProfiles).filter(profile => 
        profile.profileEnabled && profile.username && profile.services.length > 0
      );
      setConsultants(consultantList);
    } catch (error) {
      console.error('Error loading consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterConsultants = () => {
    let filtered = [...consultants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(consultant =>
        consultant.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.expertise?.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        consultant.services?.some(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Domain filter
    if (selectedDomain) {
      filtered = filtered.filter(consultant => consultant.domain === selectedDomain);
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(consultant => {
        const avgPrice = consultant.services.reduce((sum, service) => sum + service.price, 0) / consultant.services.length;
        switch (priceRange) {
          case "low":
            return avgPrice <= 1000;
          case "medium":
            return avgPrice > 1000 && avgPrice <= 3000;
          case "high":
            return avgPrice > 3000;
          default:
            return true;
        }
      });
    }

    setFilteredConsultants(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("");
    setPriceRange("all");
  };

  const getAveragePrice = (services) => {
    if (!services || services.length === 0) return 0;
    const total = services.reduce((sum, service) => sum + service.price, 0);
    return Math.round(total / services.length);
  };

  const getMinPrice = (services) => {
    if (!services || services.length === 0) return 0;
    return Math.min(...services.map(service => service.price));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading consultants...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Expert Consultants
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced professionals across various domains. 
              Browse profiles, compare services, and book consultations directly.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search consultants, expertise, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FiFilter className="h-4 w-4" />
                Filters
                {showFilters && (selectedDomain || priceRange !== "all") && (
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {(selectedDomain || priceRange !== "all") && (
                <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                  <FiX className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Domain Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full p-2 border rounded-md border-input bg-background"
                    >
                      <option value="">All Domains</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-2 border rounded-md border-input bg-background"
                    >
                      <option value="all">All Prices</option>
                      <option value="low">Low (≤ ₹1,000)</option>
                      <option value="medium">Medium (₹1,000 - ₹3,000)</option>
                      <option value="high">High (> ₹3,000)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredConsultants.length} of {consultants.length} consultants
            </p>
          </div>

          {/* Consultants Grid */}
          {filteredConsultants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No consultants found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsultants.map((consultant) => (
                <Card key={consultant.username} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                        <CardTitle className="text-lg mb-2">{consultant.fullName || consultant.username}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">{consultant.tagline}</p>
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
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {consultant.bio}
                      </p>
                    )}

                    {/* Expertise */}
                    {consultant.expertise && consultant.expertise.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-foreground mb-2">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-1">
                          {consultant.expertise.slice(0, 3).map((exp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {consultant.expertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{consultant.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Services & Pricing */}
                    {consultant.services && consultant.services.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-foreground mb-2">Services</p>
                        <div className="space-y-2">
                          {consultant.services.slice(0, 2).map((service) => (
                            <div key={service.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{service.name}</span>
                              <span className="font-medium">₹{service.price}</span>
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

                    {/* Pricing Summary */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-muted-foreground">Starting from:</span>
                      <span className="font-semibold text-brand-teal">
                        ₹{getMinPrice(consultant.services)}
                      </span>
                    </div>

                    {/* View Profile Button */}
                    <Button 
                      onClick={() => navigate(`/consultants/${consultant.username}`)}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
