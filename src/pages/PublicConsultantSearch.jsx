import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Search, 
  Star, 
  Clock, 
  DollarSign, 
  User, 
  Filter, 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { publicConsultantService } from "../services/publicConsultantService";

const domains = [
  "Software",
  "Finance", 
  "Law",
  "Admin",
  "Marketing",
  "HR",
  "Other",
];

export default function PublicConsultantSearch() {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: "",
    domain: "",
    minRating: "",
    maxPrice: "",
    minExperience: ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    // Load initial consultants
    searchConsultants();
  }, []);

  const searchConsultants = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = { ...filters, page, limit: 12 };
      const results = await publicConsultantService.searchConsultants(searchParams);
      
      setConsultants(results.consultants);
      setPagination(results.pagination);
    } catch (error) {
      console.error('Error searching consultants:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchConsultants(1);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      domain: "",
      minRating: "",
      maxPrice: "",
      minExperience: ""
    });
    searchConsultants(1);
  };

  const handleSignupToBook = (consultantId) => {
    // Store the consultant ID for post-signup redirect
    publicConsultantService.storeIntendedConsultant(consultantId);
    navigate('/signup/seeker');
  };

  const handleViewProfile = (consultantId) => {
    navigate(`/consultant/${consultantId}/public`);
  };

  const handlePageChange = (newPage) => {
    searchConsultants(newPage);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Expert Consultants
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover top consultants in your field. Sign up to book consultations.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate('/signup/seeker')} 
                className="bg-brand-teal hover:bg-brand-teal/90"
              >
                Sign Up to Book
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                Already have an account? Login
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="mb-8 bg-brand-teal/5 border-brand-teal/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-brand-teal">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Secure Search</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All consultants are verified and available. Your search is secure and private.
              </p>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Consultants
              </CardTitle>
              <CardDescription>
                Browse our expert consultants by domain, rating, and price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="query">Search</Label>
                    <Input
                      id="query"
                      placeholder="Search by name, domain, or expertise..."
                      value={filters.query}
                      onChange={(e) => handleFilterChange('query', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <select
                      id="domain"
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={filters.domain}
                      onChange={(e) => handleFilterChange('domain', e.target.value)}
                    >
                      <option value="">All Domains</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="minRating">Minimum Rating</Label>
                    <select
                      id="minRating"
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="maxPrice">Max Price (₹/hour)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="e.g., 2000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minExperience">Min Experience (years)</Label>
                    <Input
                      id="minExperience"
                      type="number"
                      placeholder="e.g., 5"
                      value={filters.minExperience}
                      onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-brand-teal hover:bg-brand-teal/90">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="mb-8 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Search Error</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Searching consultants...</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Found {pagination.totalCount} consultant{pagination.totalCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Consultant Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {consultants.map((consultant) => (
                  <Card key={consultant._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {consultant.fullName}
                        {consultant.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-500" title="Verified" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm">
                          {consultant.domain}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{consultant.rating || 0} ({consultant.totalReviews || 0} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{consultant.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>₹{consultant.hourlyRate}/hour</span>
                        </div>
                        {consultant.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {consultant.bio}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleSignupToBook(consultant._id)}
                          className="flex-1 bg-brand-teal hover:bg-brand-teal/90"
                        >
                          Sign Up to Book
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleViewProfile(consultant._id)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* No Results */}
              {consultants.length === 0 && !loading && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No consultants found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all consultants
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} 