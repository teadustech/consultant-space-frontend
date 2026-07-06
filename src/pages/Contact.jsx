import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiMessageSquare,
  FiBriefcase
} from "react-icons/fi";

export default function Contact() {
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
      value: "9703527689",
      description: "Speak with our support team",
      icon: FiPhone,
      color: "text-brand-red",
      bgColor: "bg-brand-red/10",
    },
    {
      title: "Office Address",
      value: "Kukatpally, Hyderabad, Telangana",
      description: "Visit our headquarters",
      icon: FiMapPin,
      color: "text-brand-teal",
      bgColor: "bg-brand-teal/10",
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className={`flex items-center justify-center w-16 h-16 ${info.bgColor} rounded-full mx-auto mb-4`}>
                    <info.icon className={`h-8 w-8 ${info.color}`} />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground mb-2 break-words [overflow-wrap:anywhere]">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
              href="tel:+919703527689"
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
