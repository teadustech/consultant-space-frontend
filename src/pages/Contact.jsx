import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase
} from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      title: "Email Support",
      value: "support@theconsultant.com",
      description: "Get help with your account and bookings",
      icon: FiMail,
      color: "text-brand-teal",
      bgColor: "bg-brand-teal/10",
    },
    {
      title: "Phone Support",
      value: "+91 98765 43210",
      description: "Speak with our support team",
      icon: FiPhone,
      color: "text-brand-red",
      bgColor: "bg-brand-red/10",
    },
    {
      title: "Office Address",
      value: "Mumbai, Maharashtra, India",
      description: "Visit our headquarters",
      icon: FiMapPin,
      color: "text-brand-teal",
      bgColor: "bg-brand-teal/10",
    },
    {
      title: "Business Hours",
      value: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "IST (Indian Standard Time)",
      icon: FiClock,
      color: "text-brand-red",
      bgColor: "bg-brand-red/10",
    },
    {
      title: "Company",
      value: "Teadustech Pvt Ltd",
      description: "Legal entity operating Consultant Space",
      icon: FiBriefcase,
      color: "text-brand-teal",
      bgColor: "bg-brand-teal/10",
    },
  ];

  const supportCategories = [
    {
      title: "Account & Billing",
      description: "Help with account issues, payments, and billing",
      icon: FiMessageSquare,
    },
    {
      title: "Booking Support",
      description: "Assistance with session bookings and scheduling",
      icon: FiMessageSquare,
    },
    {
      title: "Technical Issues",
      description: "Platform bugs, login problems, and technical support",
      icon: FiMessageSquare,
    },
    {
      title: "General Inquiries",
      description: "Questions about our services and platform",
      icon: FiMessageSquare,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            We're Here to{" "}
            <span className="text-brand-teal">Help</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our platform? Need help with your account? 
            Our support team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className={`flex items-center justify-center w-16 h-16 ${info.bgColor} rounded-full mx-auto mb-4`}>
                    <info.icon className={`h-8 w-8 ${info.color}`} />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground mb-2">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  {submitStatus === "success" && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <FiCheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <FiAlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800">Failed to send message. Please try again.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-2 min-h-[120px]"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FiSend className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Support Categories */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                How can we help?
              </h2>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-brand-teal/10 rounded-full">
                          <category.icon className="h-6 w-6 text-brand-teal" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-2">
                      How do I book a consultation session?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Browse our consultant directory, select an expert, and use our booking system to schedule a session at your convenience.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-2">
                      What payment methods do you accept?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      We accept all major credit cards, UPI, net banking, and digital wallets for secure payments.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-2">
                      How do I become a consultant?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Sign up as a consultant, complete your profile with credentials, and our team will verify your expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-muted-foreground">
              Located in the heart of Mumbai, our office is easily accessible 
              and we welcome visitors during business hours.
            </p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Consultant Space Headquarters
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Address:</strong><br />
                      Consultant Space Tower<br />
                      Bandra Kurla Complex<br />
                      Mumbai, Maharashtra 400051<br />
                      India
                    </p>
                    <p>
                      <strong className="text-foreground">Phone:</strong> +91 98765 43210
                    </p>
                    <p>
                      <strong className="text-foreground">Email:</strong> info@theconsultant.com
                    </p>
                    <p>
                      <strong className="text-foreground">Hours:</strong><br />
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday: 10:00 AM - 2:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FiMapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>Interactive Map Coming Soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-red">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is available to help you with any questions 
            about our platform and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@theconsultant.com"
              className="bg-white text-brand-teal px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+919876543210"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-teal transition-colors"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
