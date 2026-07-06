import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { FiSearch, FiFilter, FiX, FiUser } from "react-icons/fi";
import { publicConsultantService } from "../services/publicConsultantService";

export default function ConsultantDirectory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const domains = ["Software", "Finance", "Law", "Admin", "Marketing", "HR", "Other"];

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    loadConsultants();
  }, []);

  useEffect(() => {
    filterConsultants();
  }, [searchQuery, selectedDomain, consultants]);

  const loadConsultants = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await publicConsultantService.searchConsultants({ limit: 50 });
      setConsultants(data.consultants || []);
    } catch (err) {
      console.error("Error loading consultants:", err);
      setError("Unable to load consultants right now.");
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterConsultants = () => {
    let filtered = [...consultants];
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter((consultant) =>
        consultant.fullName?.toLowerCase().includes(query) ||
        consultant.domain?.toLowerCase().includes(query) ||
        consultant.bio?.toLowerCase().includes(query) ||
        consultant.expertise?.toLowerCase().includes(query)
      );
    }

    if (selectedDomain) {
      filtered = filtered.filter((consultant) => consultant.domain === selectedDomain);
    }

    setFilteredConsultants(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("");
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Expert Consultants
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced professionals across various domains.
              Browse profiles, compare rates, and book consultations directly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search consultants, expertise, or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FiFilter className="h-4 w-4" />
                Filters
                {showFilters && selectedDomain && (
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                )}
              </Button>

              {selectedDomain && (
                <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                  <FiX className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredConsultants.length} of {consultants.length} consultants
            </p>
          </div>

          {filteredConsultants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No consultants found</h3>
              <p className="text-muted-foreground mb-4">
                Only verified and available consultants are shown here.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsultants.map((consultant) => (
                <Card key={consultant._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-red/20 border-2 border-border flex items-center justify-center">
                          <FiUser className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{consultant.fullName}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {consultant.experience} years experience
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
                    {consultant.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {consultant.bio}
                      </p>
                    )}

                    {consultant.expertise && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-foreground mb-2">Areas of Expertise</p>
                        <Badge variant="outline" className="text-xs">
                          {consultant.expertise}
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-muted-foreground">Hourly rate:</span>
                      <span className="font-semibold text-brand-teal">
                        Rs.{consultant.hourlyRate || 0}/hr
                      </span>
                    </div>

                    <Button
                      onClick={() => navigate(`/consultant/${consultant._id}`)}
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
