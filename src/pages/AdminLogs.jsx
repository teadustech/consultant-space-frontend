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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { adminService } from "../services/adminService";

export default function AdminLogs() {
  const [adminData, setAdminData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    level: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 50,
    sortBy: "timestamp",
    sortOrder: "desc"
  });
  const [pagination, setPagination] = useState({});
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

    // Check if user has view logs permissions
    if (!parsedAdminData.permissions?.includes('view_logs')) {
      navigate('/admin/dashboard');
      return;
    }

    loadLogs();
  }, [navigate, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getLogs(filters);
      setLogs(data.logs || data);
      setPagination(data.pagination || {});
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleExportLogs = async () => {
    try {
      await adminService.exportLogs(filters);
      // Handle export success
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogLevelBadge = (level) => {
    const variants = {
      'error': 'destructive',
      'warn': 'warning',
      'info': 'info',
      'debug': 'secondary'
    };
    
    return (
      <Badge variant={variants[level] || 'secondary'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getLogTypeIcon = (type) => {
    const icons = {
      'auth': <AlertCircle className="h-4 w-4" />,
      'system': <Info className="h-4 w-4" />,
      'user': <CheckCircle className="h-4 w-4" />,
      'error': <XCircle className="h-4 w-4" />
    };
    
    return icons[type] || <Info className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading logs...</p>
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
                  System Logs
                </h1>
                <p className="text-muted-foreground">
                  View system logs, audit trails, and activity records.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={loadLogs} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={handleExportLogs} variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Log Level</label>
                  <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Log Type</label>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="user">User Activity</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date From</label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  System Logs ({pagination.totalCount || logs.length})
                </span>
              </CardTitle>
              <CardDescription>
                Recent system activity and audit logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={log._id || index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getLogLevelBadge(log.level)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getLogTypeIcon(log.type)}
                          <span className="text-sm capitalize">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate" title={log.message}>
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.user || 'System'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">{log.ipAddress || 'N/A'}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No logs found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                    {pagination.totalCount} logs
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 