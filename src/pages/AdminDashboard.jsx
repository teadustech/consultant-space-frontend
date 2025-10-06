import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings
} from "lucide-react";
import { adminService } from "../services/adminService";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const storedAdminData = localStorage.getItem('adminData');

    if (!adminToken || !storedAdminData) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(storedAdminData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardOverview();
      setDashboardData(data);
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error}</p>
          <Button onClick={loadDashboardData} className="mt-2">Retry</Button>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {adminData?.fullName}. Here's what's happening with your platform.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.overview?.totalUsers || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(dashboardData?.overview?.totalConsultants || 0)} consultants + {formatNumber(dashboardData?.overview?.totalSeekers || 0)} seekers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Consultants</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.overview?.verifiedConsultants || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.overview?.totalConsultants ? 
                    Math.round((dashboardData.overview.verifiedConsultants / dashboardData.overview.totalConsultants) * 100) : 0}% verification rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Consultants</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.overview?.activeConsultants || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Available for bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData?.overview?.totalConsultants || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Registered on platform
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Consultants
                </CardTitle>
                <CardDescription>
                  Latest consultant registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentActivity?.consultants?.map((consultant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-brand-teal/10 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-brand-teal" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{consultant.fullName}</p>
                          <p className="text-xs text-muted-foreground">{consultant.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {consultant.domain}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(consultant.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData?.recentActivity?.consultants || dashboardData.recentActivity.consultants.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No recent consultants</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Seekers
                </CardTitle>
                <CardDescription>
                  Latest seeker registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentActivity?.seekers?.map((seeker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{seeker.fullName}</p>
                          <p className="text-xs text-muted-foreground">{seeker.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(seeker.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData?.recentActivity?.seekers || dashboardData.recentActivity.seekers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No recent seekers</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domain Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Consultant Domains
              </CardTitle>
              <CardDescription>
                Distribution of consultants by domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData?.analytics?.domainStats?.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-brand-teal"></div>
                      <span className="font-medium">{domain._id}</span>
                    </div>
                    <Badge variant="secondary">{domain.count}</Badge>
                  </div>
                ))}
                {(!dashboardData?.analytics?.domainStats || dashboardData.analytics.domainStats.length === 0) && (
                  <p className="text-center text-muted-foreground py-4 col-span-full">No domain data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/admin/consultants')}
              >
                <UserCheck className="h-6 w-6" />
                <span>Manage Consultants</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/admin/seekers')}
              >
                <Users className="h-6 w-6" />
                <span>Manage Seekers</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-6 w-6" />
                <span>System Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 