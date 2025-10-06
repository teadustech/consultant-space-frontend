import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Save, User, Mail, Phone, DollarSign, Briefcase } from "lucide-react";
import axios from "axios";

const domains = [
  "Software",
  "Finance", 
  "Law",
  "Admin",
  "Marketing",
  "HR",
  "Other",
];

export default function EditProfileConsultant() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    domain: "",
    hourlyRate: "",
    experience: "",
    bio: "",
    skills: "",
    education: "",
    certifications: ""
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

    const fetchProfile = async () => {
      try {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        
        // Fetch full profile data from server
        const response = await axios.get('/api/consultants/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const profileData = response.data;
        
        // Pre-fill form with existing data
        setForm({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          domain: profileData.domain || "",
          hourlyRate: profileData.hourlyRate || "",
          experience: profileData.experience || "",
          bio: profileData.bio || "",
          skills: profileData.skills || "",
          education: profileData.education || "",
          certifications: profileData.certifications || ""
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to localStorage data if server fetch fails
        try {
          const user = JSON.parse(storedUserData);
          setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            domain: user.domain || "",
            hourlyRate: user.hourlyRate || "",
            experience: user.experience || "",
            bio: user.bio || "",
            skills: user.skills || "",
            education: user.education || "",
            certifications: user.certifications || ""
          });
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

    if (!form.fullName || !form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.phone || !form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.domain) {
      newErrors.domain = "Domain is required";
    }

    if (!form.hourlyRate) {
      newErrors.hourlyRate = "Hourly rate is required";
    } else if (isNaN(form.hourlyRate) || parseFloat(form.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Please enter a valid hourly rate";
    }

    if (!form.experience || !form.experience.trim()) {
      newErrors.experience = "Experience is required";
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
        `/api/consultants/${userData.id}/profile`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update localStorage with new user data from server response
      const updatedUserData = { ...userData, ...response.data.consultant };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      setSuccess("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({
        api: error.response?.data?.message || "Failed to update profile. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update your consultant profile information</p>
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

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your personal and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>
                  Your expertise and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <select
                    id="domain"
                    name="domain"
                    value={form.domain}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.domain ? "border-red-500" : "border-input"}`}
                  >
                    <option value="">Select your domain</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {errors.domain && (
                    <p className="text-sm text-red-600 mt-1">{errors.domain}</p>
                  )}
                </div>

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
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5+ years in software development"
                    className={errors.experience ? "border-red-500" : ""}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600 mt-1">{errors.experience}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio and Skills */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Bio & Skills</CardTitle>
                <CardDescription>
                  Tell clients about yourself and your expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    placeholder="Tell clients about your background, expertise, and what makes you unique..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills & Expertise</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleInputChange}
                    placeholder="List your key skills, technologies, and areas of expertise..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    name="education"
                    value={form.education}
                    onChange={handleInputChange}
                    placeholder="Your educational background..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    name="certifications"
                    value={form.certifications}
                    onChange={handleInputChange}
                    placeholder="Any relevant certifications or professional qualifications..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 