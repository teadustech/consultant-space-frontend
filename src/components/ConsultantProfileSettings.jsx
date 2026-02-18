import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiSave, 
  FiX,
  FiGlobe,
  FiDollarSign,
  FiClock,
  FiCamera,
  FiUser
} from "react-icons/fi";
export default function ConsultantProfileSettings() {
  const [profileEnabled, setProfileEnabled] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    tagline: "",
    bio: "",
    qualifications: "",
    experience: "",
    expertise: [],
    services: [],
    profilePicture: ""
  });
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Load existing profile data from localStorage or API
    const savedData = localStorage.getItem('consultantProfileData');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
      setProfileEnabled(true);
    }
  }, []);

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.username || !profileData.username.trim()) {
      newErrors.username = "Username is required for your profile URL";
    }
    
    if (!profileData.tagline || !profileData.tagline.trim()) {
      newErrors.tagline = "Tagline is required to describe your expertise";
    }
    
    if (!profileData.bio || !profileData.bio.trim()) {
      newErrors.bio = "Bio is required to tell seekers about yourself";
    }
    
    if (!profileData.qualifications || !profileData.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required to build trust";
    }
    
    if (!profileData.experience || !profileData.experience.trim()) {
      newErrors.experience = "Experience summary is required";
    }
    
    if (profileData.expertise.length === 0) {
      newErrors.expertise = "At least one area of expertise is required";
    }
    
    if (profileData.services.length === 0) {
      newErrors.services = "At least one service is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }
    
    setSaving(true);
    setSuccess("");
    setErrors({});
    
    try {
      // Add profileEnabled flag to the profile data
      const profileDataWithEnabled = {
        ...profileData,
        profileEnabled: true
      };
      
      // Save to localStorage for the current user
      localStorage.setItem('consultantProfileData', JSON.stringify(profileDataWithEnabled));
      
      // Save to public profiles list for seekers to access
      const allProfiles = JSON.parse(localStorage.getItem('allConsultantProfiles') || '{}');
      allProfiles[profileData.username] = profileDataWithEnabled;
      localStorage.setItem('allConsultantProfiles', JSON.stringify(allProfiles));
      
      // Debug logging
      console.log('Original profile data:', profileData);
      console.log('Profile data with enabled flag:', profileDataWithEnabled);
      console.log('All profiles after save:', allProfiles);
      console.log('Profile URL:', getProfileUrl());
      
      setSuccess(`Profile settings saved successfully! Your profile page is now live at: ${getProfileUrl()}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ api: "Failed to save profile settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price) {
      const service = {
        id: Date.now(),
        ...newService,
        price: parseFloat(newService.price)
      };
      setProfileData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      setNewService({ name: "", description: "", price: "", duration: "" });
      
      // Clear services error when service is added
      if (errors.services) {
        setErrors(prev => ({
          ...prev,
          services: ""
        }));
      }
    }
  };

  const handleUpdateService = () => {
    if (editingService && editingService.name && editingService.price) {
      setProfileData(prev => ({
        ...prev,
        services: prev.services.map(service => 
          service.id === editingService.id ? editingService : service
        )
      }));
      setEditingService(null);
    }
  };

  const handleDeleteService = (serviceId) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
    
    // Clear success message when user starts editing
    if (success) {
      setSuccess("");
    }
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setProfileData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
      
      // Clear expertise error when expertise is added
      if (errors.expertise) {
        setErrors(prev => ({
          ...prev,
          expertise: ""
        }));
      }
    }
  };

  const handleRemoveExpertise = (expertise) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertise)
    }));
  };

  const getProfileUrl = () => {
    if (profileData.username) {
      return `${window.location.origin}/consultants/${profileData.username}`;
    }
    return "Set a username to get your profile URL";
  };

  const handleProfilePictureChange = (event) => {
    console.log('File input change event:', event);
    const file = event.target.files[0];
    console.log('Selected file:', file);
    
    if (file) {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUploadingImage(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        console.log('FileReader result:', e.target.result.substring(0, 100) + '...');
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
        setUploadingImage(false);
        // Show temporary success message
        setSuccess('Profile picture uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file. Please try again.');
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(file);
      
      // Reset the file input for future use
      event.target.value = '';
    } else {
      console.log('No file selected');
    }
  };

  const removeProfilePicture = () => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: ""
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Enable/Disable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiGlobe className="h-5 w-5" />
            Dedicated Profile Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Enable a dedicated profile page for your consulting services
              </p>
              <p className="text-xs text-muted-foreground">
                This will create a public page where seekers can view your services and book directly
              </p>
            </div>
            <Switch
              checked={profileEnabled}
              onCheckedChange={setProfileEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {profileEnabled && (
        <>
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiCamera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {/* Current Profile Picture */}
                <div className="relative">
                  {profileData.profilePicture ? (
                    <div className="relative">
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-border shadow-lg"
                      />
                      <button
                        onClick={removeProfilePicture}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove picture"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-red/20 border-4 border-dashed border-border flex items-center justify-center">
                      <FiUser className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                                 {/* Upload Button */}
                 <div className="flex flex-col items-center space-y-2">
                   <div className="relative">
                     <input
                       id="profile-picture"
                       type="file"
                       accept="image/*"
                       onChange={handleProfilePictureChange}
                       className="hidden"
                     />
                     <Button 
                       variant="outline" 
                       className="flex items-center gap-2 cursor-pointer"
                       onClick={() => document.getElementById('profile-picture').click()}
                       disabled={uploadingImage}
                     >
                       {uploadingImage ? (
                         <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                           Processing...
                         </>
                       ) : (
                         <>
                           <FiCamera className="h-4 w-4" />
                           {profileData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                         </>
                       )}
                     </Button>
                   </div>
                   <p className="text-xs text-muted-foreground text-center">
                     Recommended: Square image, max 5MB<br />
                     Supported formats: JPG, PNG, GIF
                   </p>
                   <button
                     type="button"
                     onClick={() => {
                       console.log('Testing file input click...');
                       const fileInput = document.getElementById('profile-picture');
                       console.log('File input element:', fileInput);
                       if (fileInput) {
                         fileInput.click();
                       } else {
                         console.error('File input not found!');
                       }
                     }}
                     className="text-xs text-blue-600 hover:text-blue-800 underline"
                   >
                     Test File Input
                   </button>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile URL */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value={getProfileUrl()}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(getProfileUrl())}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username (for URL)</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="your-username"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={profileData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="e.g., Expert Business Strategist"
                    className={errors.tagline ? "border-red-500" : ""}
                  />
                  {errors.tagline && (
                    <p className="text-sm text-red-600 mt-1">{errors.tagline}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell seekers about yourself and your approach..."
                  rows={3}
                  className={errors.bio ? "border-red-500" : ""}
                />
                {errors.bio && (
                  <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
                )}
              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="qualifications">Qualifications & Certifications</Label>
                    <Textarea
                      id="qualifications"
                      value={profileData.qualifications}
                      onChange={(e) => handleInputChange('qualifications', e.target.value)}
                      placeholder="List your qualifications, degrees, certifications..."
                      rows={3}
                      className={errors.qualifications ? "border-red-500" : ""}
                    />
                    {errors.qualifications && (
                      <p className="text-sm text-red-600 mt-1">{errors.qualifications}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Summary</Label>
                    <Textarea
                      id="experience"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Brief overview of your professional experience..."
                      rows={3}
                      className={errors.experience ? "border-red-500" : ""}
                    />
                    {errors.experience && (
                      <p className="text-sm text-red-600 mt-1">{errors.experience}</p>
                    )}
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Areas of Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area"
                  className="flex-1"
                />
                <Button onClick={handleAddExpertise} size="sm">
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profileData.expertise.map((expertise, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {expertise}
                    <button
                      onClick={() => handleRemoveExpertise(expertise)}
                      className="ml-1 hover:text-destructive"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {errors.expertise && (
                <p className="text-sm text-red-600 mt-1">{errors.expertise}</p>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiDollarSign className="h-5 w-5" />
                Services & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Service */}
              <div className="border rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-3">Add New Service</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      value={newService.name}
                      onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Business Strategy Session"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servicePrice">Price (₹)</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="serviceDuration">Duration</Label>
                    <Input
                      id="serviceDuration"
                      value={newService.duration}
                      onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 1 hour"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceDescription">Description</Label>
                    <Textarea
                      id="serviceDescription"
                      value={newService.description}
                      onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this service includes..."
                      rows={2}
                    />
                  </div>
                </div>
                <Button onClick={handleAddService} className="mt-4">
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {/* Existing Services */}
              <div className="space-y-4">
                {profileData.services.map((service) => (
                  <Card key={service.id} className="border">
                    <CardContent className="p-4">
                      {editingService?.id === service.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={editingService.name}
                              onChange={(e) => setEditingService(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <Input
                              type="number"
                              value={editingService.price}
                              onChange={(e) => setEditingService(prev => ({ ...prev, price: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={editingService.duration}
                              onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))}
                            />
                            <Textarea
                              value={editingService.description}
                              onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                              rows={2}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdateService} size="sm">
                              <FiSave className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingService(null)}
                            >
                              <FiX className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{service.name}</h4>
                              <Badge variant="outline">₹{service.price}</Badge>
                              {service.duration && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <FiClock className="h-3 w-3" />
                                  {service.duration}
                                </div>
                              )}
                            </div>
                            {service.description && (
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <FiEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.services && (
                <p className="text-sm text-red-600 mt-1">{errors.services}</p>
              )}
            </CardContent>
          </Card>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}
          
          {errors.api && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errors.api}</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button onClick={handleSaveProfile} size="lg" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Profile Settings"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
