import React, { useState } from "react";
import InputField from "../components/forms/InputField";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import { Link } from "react-router-dom";
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

export default function SignupConsultant() {
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    domain: "Software",
    experience: "",
    rate: "",
    password: "",
  });
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
    if (!form.domain) errs.domain = "Domain/Expertise is required.";
    if (!form.experience) errs.experience = "Experience is required.";
    else if (isNaN(form.experience) || Number(form.experience) < 0) errs.experience = "Enter a valid number of years.";
    if (!form.rate) errs.rate = "Hourly Rate is required.";
    else if (isNaN(form.rate) || Number(form.rate) <= 0) errs.rate = "Enter a valid hourly rate.";
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
      await axios.post("/api/consultant/register", form);
      setSuccess("Registration successful! You can now log in.");
      setForm({ fullName: "", email: "", phone: "", domain: "Software", experience: "", rate: "", password: "" });
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
          <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Sign Up as Consultant</h2>
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
            placeholder="Phone number"
            autoComplete="tel"
          />
          {/* Domain/Expertise dropdown */}
          <div className="mb-4">
            <label htmlFor="domain" className="block text-sm font-medium text-foreground mb-1">
              Domain/Expertise
            </label>
            <select
              id="domain"
              name="domain"
              value={form.domain}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition bg-background text-foreground placeholder:text-muted-foreground ${errors.domain ? "border-destructive" : "border-input"}`}
            >
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.domain && <p className="text-xs text-destructive mt-1">{errors.domain}</p>}
          </div>
          <InputField
            label="Experience (years)"
            name="experience"
            type="number"
            value={form.experience}
            onChange={handleChange}
            error={errors.experience}
            placeholder="Years of experience"
            min="0"
          />
          <InputField
            label="Hourly Rate (₹)"
            name="rate"
            type="number"
            value={form.rate}
            onChange={handleChange}
            error={errors.rate}
            placeholder="Hourly rate in INR"
            min="1"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
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