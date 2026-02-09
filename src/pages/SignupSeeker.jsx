import React, { useState } from "react";
import InputField from "../components/forms/InputField";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { publicConsultantService } from "../services/publicConsultantService";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/utils";

export default function SignupSeeker() {
  const navigate = useNavigate();
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // Error state
  const [errors, setErrors] = useState({});
  // Success state
  const [success, setSuccess] = useState("");
  // Loading state
  const [loading, setLoading] = useState(false);

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!form.fullName || !form.fullName.trim()) errs.fullName = "Full Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email format.";
    if (!form.phone) errs.phone = "Phone Number is required.";
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = "Phone must be 10 digits.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
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
      await axios.post("/api/seeker/register", form);
      setSuccess("Registration successful! You can now log in.");
      setForm({ fullName: "", email: "", phone: "", password: "" });
      
      // Check if user came from public search
      const intendedConsultantId = publicConsultantService.getAndClearIntendedConsultant();
      if (intendedConsultantId) {
        // Redirect to booking page for that consultant
        setTimeout(() => {
          navigate(`/book-consultation/${intendedConsultantId}`);
        }, 2000);
      }
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header with logo and nav */}
      <Header />
      <div className="flex justify-center items-center min-h-[80vh] bg-background py-8 px-2">
        <form
          className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md border border-border"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Sign Up as Seeker</h2>
          <InputField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="Enter your full name"
            autoComplete="name"
          />
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
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="10 digit phone number"
            autoComplete="tel"
          />
          {/* Password field with show/hide toggle */}
          <div className="mb-4 space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
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
          {errors.api && <p className="text-destructive text-sm mb-2">{errors.api}</p>}
          {success && <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded mb-2 text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold mt-2 hover:bg-primary/90 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </div>
        </form>
      </div>
      <Chatbot />
    </>
  );
} 