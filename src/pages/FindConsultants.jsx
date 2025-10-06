import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Search, Star, Clock, DollarSign, User, Filter } from "lucide-react";
import { consultantService } from "../services/consultantService";

const domains = [
  "Software",
  "Finance", 
  "Law",
  "Admin",
  "Marketing",
  "HR",
  "Other",
];

export default function FindConsultants() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    domain: "",
    minRating: "",
    maxPrice: "",
    minExperience: ""
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    const storedUserData = localStorage.getItem('userData');

    if (!token || !storedUserType || !storedUserData || storedUserType !== 'seeker') {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUserData);
    setUserData(user);
    
    // Load initial consultants
    searchConsultants();
  }, [navigate]);

  const searchConsultants = async () => {
    setLoading(true);
    try {
      const results = await consultantService.searchConsultants(filters);
      setConsultants(results);
    } catch (error) {
      console.error('Error searching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchConsultants();
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      domain: "",
      minRating: "",
      maxPrice: "",
      minExperience: ""
    });
  };

  const handleBookConsultation = (consultantId) => {
    // Navigate to booking page
    navigate(`/book/${consultantId}`);
  };

  const handleViewProfile = (consultantId) => {
    // Navigate to consultant profile (to be implemented)
    navigate(`/consultant/${consultantId}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Find Consultants
            </h1>
            <p className="text-muted-foreground">
              Discover and book consultations with expert consultants
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Consultants
              </CardTitle>
              <CardDescription>
                Find the perfect consultant for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="query">Search</Label>
                    <Input
                      id="query"
                      name="query"
                      value={filters.query}
                      onChange={(e) => handleFilterChange('query', e.target.value)}
                      placeholder="Search by name, expertise, or keywords..."
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" variant="brand" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <select
                      id="domain"
                      name="domain"
                      value={filters.domain}
                      onChange={(e) => handleFilterChange('domain', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition bg-background text-foreground border-input"
                    >
                      <option value="">All Domains</option>
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="minRating">Min Rating</Label>
                    <select
                      id="minRating"
                      name="minRating"
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition bg-background text-foreground border-input"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="maxPrice">Max Price (₹/hr)</Label>
                    <Input
                      id="maxPrice"
                      name="maxPrice"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max hourly rate"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minExperience">Min Experience</Label>
                    <Input
                      id="minExperience"
                      name="minExperience"
                      type="number"
                      value={filters.minExperience}
                      onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                      placeholder="Years of experience"
                      min="0"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg">Searching consultants...</div>
              </div>
            ) : consultants.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No consultants found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button variant="brand" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {consultants.length} Consultant{consultants.length !== 1 ? 's' : ''} Found
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    Showing filtered results
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {consultants.map((consultant) => (
                    <Card key={consultant._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{consultant.fullName}</CardTitle>
                              <CardDescription>{consultant.domain}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{consultant.rating || 0}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Experience</span>
                            <span className="font-medium">{consultant.experience} years</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rate</span>
                            <span className="font-medium flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {consultant.hourlyRate}/hr
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Reviews</span>
                            <span className="font-medium">{consultant.totalReviews || 0}</span>
                          </div>
                        </div>

                        {consultant.expertise && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Expertise</p>
                            <p className="text-sm">{consultant.expertise}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            variant="brand" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleBookConsultation(consultant._id)}
                          >
                            Book Consultation
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProfile(consultant._id)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 