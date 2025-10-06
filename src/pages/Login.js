import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, UserCheck, Eye, EyeOff, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  
  // Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "seeker", // Default to seeker
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email format.";
    if (!form.password) errs.password = "Password is required.";
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
      const response = await axios.post("/api/login", { 
        email: form.email, 
        password: form.password,
        userType: form.role
      });
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.user.userType);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setSuccess("Login successful! Redirecting to dashboard...");
      
      // Redirect to appropriate dashboard based on user type
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Login failed. Please check your credentials." });
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
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">I am a:</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={form.role === "seeker" ? "brand" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={() => setForm({ ...form, role: "seeker" })}
                >
                  <User className="mr-2 h-4 w-4" />
                  Seeker
                </Button>
                <Button
                  type="button"
                  variant={form.role === "consultant" ? "brand" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={() => setForm({ ...form, role: "consultant" })}
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
                placeholder="Enter your email"
                autoComplete="email"
              />
              
              {/* Password field with show/hide toggle */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={cn(
                      "pr-10",
                      errors.password && "border-destructive focus-visible:ring-destructive"
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
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-input text-brand-teal focus:ring-brand-teal"
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-brand-teal hover:underline">
                  Forgot password?
                </Link>
              </div>

              {errors.api && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                  {errors.api}
                </div>
              )}
                             {success && (
                 <div className="p-3 text-sm text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20 rounded-md text-center flex items-center justify-center gap-2">
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-teal hover:underline font-medium">
                Sign up here
              </Link>
            </div>

            {/* Demo credentials info */}
            <div className="p-4 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
              <h4 className="text-sm font-medium text-brand-teal mb-2">Demo Credentials:</h4>
              <div className="text-xs text-brand-teal/80 space-y-1">
                <p><strong>Seeker:</strong> seeker@demo.com / password123</p>
                <p><strong>Consultant:</strong> consultant@demo.com / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Chatbot />
    </>
  );
}