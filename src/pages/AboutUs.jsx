import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiUsers, 
  FiTarget, 
  FiAward, 
  FiShield, 
  FiTrendingUp, 
  FiGlobe,
  FiCheckCircle,
  FiStar
} from "react-icons/fi";

export default function AboutUs() {
  const stats = [
    { label: "Expert Consultants", value: "500+", icon: FiUsers },
    { label: "Successful Sessions", value: "10,000+", icon: FiCheckCircle },
    { label: "Happy Clients", value: "5,000+", icon: FiStar },
    { label: "Domains Covered", value: "15+", icon: FiGlobe },
  ];

  const values = [
    {
      title: "Excellence",
      description: "We connect you with verified experts who excel in their fields",
      icon: FiAward,
    },
    {
      title: "Trust",
      description: "Secure platform with verified consultants and transparent processes",
      icon: FiShield,
    },
    {
      title: "Innovation",
      description: "Leveraging technology to make expert consultation accessible",
      icon: FiTrendingUp,
    },
    {
      title: "Accessibility",
      description: "Making expert knowledge available to everyone, anywhere",
      icon: FiGlobe,
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former consultant with 15+ years of experience in business strategy and digital transformation.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Technology leader with expertise in building scalable platforms and AI-driven solutions.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      bio: "Operations expert focused on creating seamless user experiences and platform optimization.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-lg font-semibold">
            About The Consultant Space
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Connecting You with{" "}
            <span className="text-brand-teal">Expert Knowledge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The Consultant Space is India's premier platform connecting seekers with verified experts 
            across diverse domains. We believe everyone deserves access to expert guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-full mx-auto mb-3">
                  <stat.icon className="h-8 w-8 text-brand-teal" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Information Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Legal Information
          </h3>
          <p className="text-muted-foreground">
            The Consultant Space is operated by <strong>Teadustech Pvt Ltd</strong>, 
            a registered company in India.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                To democratize access to expert knowledge by creating a trusted platform 
                where seekers can connect with verified consultants across various domains.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We believe that everyone, regardless of their location or background, 
                should have access to the expertise they need to succeed in their personal 
                and professional endeavors.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="text-brand-teal border-brand-teal">
                  <FiTarget className="h-4 w-4 mr-2" />
                  Expert Verified
                </Badge>
                <Badge variant="outline" className="text-brand-red border-brand-red">
                  <FiShield className="h-4 w-4 mr-2" />
                  Secure Platform
                </Badge>
                <Badge variant="outline" className="text-brand-teal border-brand-teal">
                  <FiGlobe className="h-4 w-4 mr-2" />
                  Global Access
                </Badge>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-teal/20 to-brand-red/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Why Choose The Consultant Space?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Verified Experts</h4>
                    <p className="text-muted-foreground">All consultants undergo rigorous verification</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Secure Platform</h4>
                    <p className="text-muted-foreground">End-to-end encrypted communication</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Flexible Scheduling</h4>
                    <p className="text-muted-foreground">Book sessions at your convenience</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Transparent Pricing</h4>
                    <p className="text-muted-foreground">Clear rates with no hidden fees</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience 
              we provide to our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-full mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-brand-teal" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind The Consultant Space platform, 
              dedicated to connecting you with expert knowledge.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-red">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Connect with Experts?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of seekers who have found the guidance they need 
            through The Consultant Space platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/public/search"
              className="bg-white text-brand-teal px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Consultants
            </Link>
            <Link
              to="/signup/consultant"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-teal transition-colors"
            >
              Become a Consultant
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
