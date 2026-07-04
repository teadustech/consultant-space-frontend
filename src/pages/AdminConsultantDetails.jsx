import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Briefcase, CheckCircle, Clock, DollarSign, Mail, Phone, Star, User, XCircle } from "lucide-react";
import { adminService } from "../services/adminService";

export default function AdminConsultantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const storedAdminData = localStorage.getItem("adminData");

    if (!adminToken || !storedAdminData) {
      navigate("/admin/login");
      return;
    }

    setAdminData(JSON.parse(storedAdminData));
    loadConsultant();
  }, [id, navigate]);

  const loadConsultant = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.getConsultant(id);
      setConsultant(data.consultant);
    } catch (error) {
      setError(error.message || "Failed to load consultant details");
      if (error.message?.includes("401") || error.message?.includes("403")) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/admin/login");
  };

  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading consultant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar adminData={adminData} onLogout={handleLogout} />

      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin/consultants")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Consultants
          </Button>

          {error && (
            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => navigate("/admin/consultants")}>Back to Consultants</Button>
              </CardContent>
            </Card>
          )}

          {!error && consultant && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{consultant.fullName}</h1>
                <p className="text-muted-foreground">Consultant account details and verification status.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Detail icon={Mail} label="Email" value={consultant.email} />
                      <Detail icon={Phone} label="Phone" value={consultant.phone} />
                      <Detail icon={Briefcase} label="Domain" value={consultant.domain} />
                      <Detail icon={Clock} label="Experience" value={`${consultant.experience || 0} years`} />
                      <Detail icon={DollarSign} label="Hourly Rate" value={`${formatCurrency(consultant.hourlyRate)}/hr`} />
                      <Detail icon={Star} label="Rating" value={`${consultant.rating || 0} (${consultant.totalReviews || 0} reviews)`} />
                    </div>

                    {consultant.bio && (
                      <TextBlock title="Bio" value={consultant.bio} />
                    )}
                    {consultant.expertise && (
                      <TextBlock title="Expertise" value={consultant.expertise} />
                    )}
                    {consultant.skills && (
                      <TextBlock title="Skills" value={consultant.skills} />
                    )}
                    {consultant.education && (
                      <TextBlock title="Education" value={consultant.education} />
                    )}
                    {consultant.certifications && (
                      <TextBlock title="Certifications" value={consultant.certifications} />
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <StatusBadge enabled={consultant.isVerified} enabledText="Verified" disabledText="Not Verified" />
                      <StatusBadge enabled={consultant.isAvailable} enabledText="Available" disabledText="Not Available" />
                      <StatusBadge enabled={consultant.profileEnabled} enabledText="Public Profile Enabled" disabledText="Public Profile Disabled" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Joined</span>
                        <p className="font-medium">{formatDate(consultant.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated</span>
                        <p className="font-medium">{formatDate(consultant.updatedAt)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Commission Rate</span>
                        <p className="font-medium">{consultant.commissionRate ?? 10}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-1" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function TextBlock({ title, value }) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function StatusBadge({ enabled, enabledText, disabledText }) {
  return (
    <div className="flex items-center gap-2">
      {enabled ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <Badge variant={enabled ? "default" : "secondary"}>
        {enabled ? enabledText : disabledText}
      </Badge>
    </div>
  );
}
