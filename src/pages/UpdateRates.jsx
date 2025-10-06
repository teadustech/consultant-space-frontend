import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Save, DollarSign, TrendingUp, TrendingDown, Info } from "lucide-react";
import axios from "axios";

export default function UpdateRates() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    hourlyRate: "",
    consultationFee: "",
    packageRate: "",
    emergencyRate: ""
  });

  // Mock market data for insights
  const [marketData] = useState({
    averageRate: 1200,
    minRate: 500,
    maxRate: 3000,
    yourRank: "75th percentile",
    recommendations: [
      "Your current rate is competitive for your experience level",
      "Consider offering package deals for long-term clients",
      "Emergency consultation rates can be 1.5x your regular rate"
    ]
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

    try {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      
      // Pre-fill form with existing data
      setForm({
        hourlyRate: user.hourlyRate || "",
        consultationFee: user.consultationFee || "",
        packageRate: user.packageRate || "",
        emergencyRate: user.emergencyRate || ""
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.hourlyRate) {
      newErrors.hourlyRate = "Hourly rate is required";
    } else if (isNaN(form.hourlyRate) || parseFloat(form.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Please enter a valid hourly rate";
    }

    if (form.consultationFee && (isNaN(form.consultationFee) || parseFloat(form.consultationFee) < 0)) {
      newErrors.consultationFee = "Please enter a valid consultation fee";
    }

    if (form.packageRate && (isNaN(form.packageRate) || parseFloat(form.packageRate) <= 0)) {
      newErrors.packageRate = "Please enter a valid package rate";
    }

    if (form.emergencyRate && (isNaN(form.emergencyRate) || parseFloat(form.emergencyRate) <= 0)) {
      newErrors.emergencyRate = "Please enter a valid emergency rate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setSuccess("");
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/consultants/${userData._id}/rates`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update localStorage with new user data
      const updatedUserData = { ...userData, ...form };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      setSuccess("Rates updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error('Rate update error:', error);
      setErrors({
        api: error.response?.data?.message || "Failed to update rates. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  const getRateComparison = () => {
    const currentRate = parseFloat(form.hourlyRate) || 0;
    const avgRate = marketData.averageRate;
    
    if (currentRate === 0) return null;
    
    const difference = currentRate - avgRate;
    const percentage = ((difference / avgRate) * 100).toFixed(1);
    
    return {
      difference,
      percentage,
      isHigher: difference > 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading rates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rateComparison = getRateComparison();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Update Rates</h1>
            <p className="text-muted-foreground">Manage your consultation pricing and rates</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.api && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{errors.api}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Rate Settings */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Rate Settings
                  </CardTitle>
                  <CardDescription>
                    Set your consultation rates and pricing structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      value={form.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="Enter your hourly rate"
                      className={errors.hourlyRate ? "border-red-500" : ""}
                    />
                    {errors.hourlyRate && (
                      <p className="text-sm text-red-600 mt-1">{errors.hourlyRate}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      This is your standard hourly consultation rate
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="consultationFee">Initial Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      value={form.consultationFee}
                      onChange={handleInputChange}
                      placeholder="Optional one-time fee for first consultation"
                      className={errors.consultationFee ? "border-red-500" : ""}
                    />
                    {errors.consultationFee && (
                      <p className="text-sm text-red-600 mt-1">{errors.consultationFee}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      One-time fee for initial consultation (optional)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="packageRate">Package Rate (₹/hour)</Label>
                    <Input
                      id="packageRate"
                      name="packageRate"
                      type="number"
                      value={form.packageRate}
                      onChange={handleInputChange}
                      placeholder="Discounted rate for package bookings"
                      className={errors.packageRate ? "border-red-500" : ""}
                    />
                    {errors.packageRate && (
                      <p className="text-sm text-red-600 mt-1">{errors.packageRate}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Discounted rate for clients booking multiple sessions
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="emergencyRate">Emergency Rate (₹/hour)</Label>
                    <Input
                      id="emergencyRate"
                      name="emergencyRate"
                      type="number"
                      value={form.emergencyRate}
                      onChange={handleInputChange}
                      placeholder="Premium rate for urgent consultations"
                      className={errors.emergencyRate ? "border-red-500" : ""}
                    />
                    {errors.emergencyRate && (
                      <p className="text-sm text-red-600 mt-1">{errors.emergencyRate}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium rate for urgent or same-day consultations
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Update Rates
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Market Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Insights
                </CardTitle>
                <CardDescription>
                  How your rates compare to the market
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Market Average</p>
                  <p className="text-2xl font-bold">₹{marketData.averageRate}</p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>

                {rateComparison && (
                  <div className={`text-center p-4 rounded-lg ${
                    rateComparison.isHigher ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {rateComparison.isHigher ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        rateComparison.isHigher ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        {rateComparison.isHigher ? 'Above' : 'Below'} Average
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${
                      rateComparison.isHigher ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {rateComparison.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{Math.abs(rateComparison.difference)} difference
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Range:</span>
                    <span className="font-medium">₹{marketData.minRate} - ₹{marketData.maxRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Rank:</span>
                    <span className="font-medium">{marketData.yourRank}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Tips to optimize your pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {marketData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 