import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Settings, 
  Save, 
  RefreshCw,
  Shield,
  Bell,
  Globe,
  Zap,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { adminService } from "../services/adminService";

export default function AdminSettings() {
  const [adminData, setAdminData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const storedAdminData = localStorage.getItem('adminData');

    if (!adminToken || !storedAdminData) {
      navigate('/admin/login');
      return;
    }

    const parsedAdminData = JSON.parse(storedAdminData);
    setAdminData(parsedAdminData);

    // Check if user has manage settings permissions
    if (!parsedAdminData.permissions?.includes('manage_settings')) {
      navigate('/admin/dashboard');
      return;
    }

    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      setSettings(data);
    } catch (error) {
      setError(error.message);
      if (error.message.includes('401') || error.message.includes('403')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      await adminService.updateSettings(settings);
      setSuccess("Settings updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar adminData={adminData} onLogout={handleLogout} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  System Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure platform settings and system preferences.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={loadSettings} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Platform Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Platform Settings
              </CardTitle>
              <CardDescription>
                Basic platform configuration and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input
                    value={settings?.platform?.name || ''}
                    onChange={(e) => handleSettingChange('platform', 'name', e.target.value)}
                    placeholder="Consultant Space"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Version</label>
                  <Input
                    value={settings?.platform?.version || ''}
                    onChange={(e) => handleSettingChange('platform', 'version', e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintenance"
                  checked={settings?.platform?.maintenance || false}
                  onChange={(e) => handleSettingChange('platform', 'maintenance', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="maintenance" className="text-sm font-medium">
                  Enable Maintenance Mode
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (hours)</label>
                  <Input
                    type="number"
                    value={settings?.security?.sessionTimeout || 24}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={settings?.security?.maxLoginAttempts || 5}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mfaRequired"
                  checked={settings?.security?.mfaRequired || false}
                  onChange={(e) => handleSettingChange('security', 'mfaRequired', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="mfaRequired" className="text-sm font-medium">
                  Require Multi-Factor Authentication
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and delivery methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings?.notifications?.emailNotifications || false}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="emailNotifications" className="text-sm font-medium">
                    Enable Email Notifications
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings?.notifications?.smsNotifications || false}
                    onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="smsNotifications" className="text-sm font-medium">
                    Enable SMS Notifications
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Feature Toggles
              </CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="publicSearch"
                    checked={settings?.features?.publicSearch || false}
                    onChange={(e) => handleSettingChange('features', 'publicSearch', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="publicSearch" className="text-sm font-medium">
                    Public Search
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="chatbot"
                    checked={settings?.features?.chatbot || false}
                    onChange={(e) => handleSettingChange('features', 'chatbot', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="chatbot" className="text-sm font-medium">
                    Chatbot
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={settings?.features?.analytics || false}
                    onChange={(e) => handleSettingChange('features', 'analytics', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="analytics" className="text-sm font-medium">
                    Analytics
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system status and health indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">250ms</div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1.0.0</div>
                  <p className="text-sm text-muted-foreground">Current Version</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 