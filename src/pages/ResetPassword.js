import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { cn } from "../lib/utils";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Form state
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);

  // Get token and userType from URL
  const token = searchParams.get('token');
  const userType = searchParams.get('userType');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !userType) {
        setErrors({ api: "Invalid reset link. Please request a new password reset." });
        setValidating(false);
        return;
      }

      try {
        await axios.post(apiUrl("/api/verify-reset-token"), { token, userType });
        setTokenValid(true);
      } catch (err) {
        setErrors({ api: err.response?.data?.message || "Invalid or expired reset link. Please request a new password reset." });
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, userType]);

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!form.newPassword) errs.newPassword = "New password is required.";
    else if (form.newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters.";
    
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    
    return errs;
  };

  // Handle input change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(apiUrl("/api/reset-password"), { 
        token,
        userType,
        newPassword: form.newPassword
      });
      
      setSuccess(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to reset password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-2">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto mb-4"></div>
                <p className="text-muted-foreground">Validating reset link...</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Chatbot />
      </>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-2">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Link to="/forgot-password" className="text-brand-teal hover:text-brand-teal/80">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.api}
              </div>
              
              <div className="text-center">
                <Link to="/forgot-password">
                  <Button variant="brand" size="lg" className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Chatbot />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-2">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/login" className="text-brand-teal hover:text-brand-teal/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* New Password field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    className={cn(
                      "pr-10",
                      errors.newPassword && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    className={cn(
                      "pr-10",
                      errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              {errors.api && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.api}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20 rounded-md text-center flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-brand-teal hover:underline font-medium">
                Sign in here
              </Link>
            </div>

            {/* Security info */}
            <div className="p-4 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
              <h4 className="text-sm font-medium text-brand-teal mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password Requirements
              </h4>
              <div className="text-xs text-brand-teal/80 space-y-1">
                <p>• At least 6 characters long</p>
                <p>• Use a mix of letters, numbers, and symbols</p>
                <p>• Avoid common passwords</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Chatbot />
    </>
  );
} 