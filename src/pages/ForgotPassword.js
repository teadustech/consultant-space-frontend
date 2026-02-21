import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/forms/InputField";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { User, UserCheck, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function ForgotPassword() {
  // Form state
  const [form, setForm] = useState({
    email: "",
    userType: "seeker", // Default to seeker
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email format.";
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
      const response = await axios.post(apiUrl("/api/forgot-password"), { 
        email: form.email, 
        userType: form.userType
      });
      
      setSuccess(response.data.message);
      setForm({ email: "", userType: form.userType });
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to send reset email. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your email and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">I am a:</label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={form.userType === "seeker" ? "brand" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={() => setForm({ ...form, userType: "seeker" })}
                >
                  <User className="mr-2 h-4 w-4" />
                  Seeker
                </Button>
                <Button
                  type="button"
                  variant={form.userType === "consultant" ? "brand" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={() => setForm({ ...form, userType: "consultant" })}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Consultant
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email address"
                autoComplete="email"
              />

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
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-brand-teal hover:underline font-medium">
                Sign in here
              </Link>
            </div>

            {/* Help text */}
            <div className="p-4 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
              <h4 className="text-sm font-medium text-brand-teal mb-2">What happens next?</h4>
              <div className="text-xs text-brand-teal/80 space-y-1">
                <p>• We'll send a secure link to your email</p>
                <p>• The link will expire in 30 minutes</p>
                <p>• Click the link to set a new password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Chatbot />
    </>
  );
} 