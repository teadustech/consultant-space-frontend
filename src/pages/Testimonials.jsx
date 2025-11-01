import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiStar, 
  FiMessageSquare, 
  FiUser, 
  FiBriefcase, 
  FiCalendar,
  FiMapPin,
  FiThumbsUp
} from "react-icons/fi";

export default function Testimonials() {
  const [activeFilter, setActiveFilter] = useState("all");

  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Startup Founder",
      company: "TechStart India",
      location: "Mumbai, India",
      rating: 5,
      category: "seeker",
      domain: "Business Strategy",
      date: "December 2024",
      content: "Consultant Space helped me find an amazing business strategist who guided me through scaling my startup. The session was incredibly valuable and helped me avoid costly mistakes. Highly recommended!",
      consultant: "Dr. Priya Patel",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      role: "Business Consultant",
      company: "Strategic Solutions",
      location: "Delhi, India",
      rating: 5,
      category: "consultant",
      domain: "Business Strategy",
      date: "December 2024",
      content: "Being a consultant on this platform has been incredibly rewarding. I've helped numerous entrepreneurs and businesses achieve their goals. The platform is professional and the clients are motivated to learn.",
      earnings: "₹2,50,000+",
      sessions: "45+",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Anjali Desai",
      role: "Marketing Manager",
      company: "Digital Marketing Pro",
      location: "Bangalore, India",
      rating: 5,
      category: "seeker",
      domain: "Digital Marketing",
      date: "November 2024",
      content: "I was struggling with our digital marketing strategy. Found an expert consultant who not only provided great insights but also helped me implement actionable strategies. Our ROI improved by 300%!",
      consultant: "Vikram Singh",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Digital Marketing Expert",
      company: "Growth Hackers",
      location: "Pune, India",
      rating: 5,
      category: "consultant",
      domain: "Digital Marketing",
      date: "November 2024",
      content: "The platform has given me the opportunity to share my expertise with businesses that truly need it. The booking system is seamless and the clients are always well-prepared for our sessions.",
      earnings: "₹1,80,000+",
      sessions: "32+",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Meera Iyer",
      role: "HR Director",
      company: "Global Tech Corp",
      location: "Chennai, India",
      rating: 5,
      category: "seeker",
      domain: "Human Resources",
      date: "October 2024",
      content: "We were facing challenges with employee retention and culture building. Our HR consultant provided practical solutions that we could implement immediately. The results were visible within weeks.",
      consultant: "Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Rajesh Kumar",
      role: "HR Consultant",
      company: "People First Consulting",
      location: "Hyderabad, India",
      rating: 5,
      category: "consultant",
      domain: "Human Resources",
      date: "October 2024",
      content: "I love helping organizations build better workplaces. Consultant Space has connected me with companies that are genuinely committed to improving their HR practices.",
      earnings: "₹1,20,000+",
      sessions: "28+",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "Arjun Reddy",
      role: "Software Engineer",
      company: "Tech Innovations",
      location: "Kolkata, India",
      rating: 5,
      category: "seeker",
      domain: "Software Development",
      date: "September 2024",
      content: "I was looking to transition into a new technology stack. My consultant not only taught me the technical aspects but also helped me understand the industry trends and career opportunities.",
      consultant: "Sneha Gupta",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      name: "Sneha Gupta",
      role: "Senior Software Architect",
      company: "Tech Leaders",
      location: "Gurgaon, India",
      rating: 5,
      category: "consultant",
      domain: "Software Development",
      date: "September 2024",
      content: "Mentoring developers and helping them grow in their careers is incredibly fulfilling. The platform makes it easy to connect with motivated learners who are eager to improve their skills.",
      earnings: "₹3,00,000+",
      sessions: "52+",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { label: "Total Reviews", value: "1,247", icon: FiStar },
    { label: "Average Rating", value: "4.9/5", icon: FiThumbsUp },
    { label: "Success Stories", value: "500+", icon: FiUser },
    { label: "Expert Consultants", value: "200+", icon: FiBriefcase },
  ];

  const filters = [
    { key: "all", label: "All Testimonials" },
    { key: "seeker", label: "Seeker Stories" },
    { key: "consultant", label: "Consultant Stories" },
  ];

  const filteredTestimonials = testimonials.filter(
    testimonial => activeFilter === "all" || testimonial.category === activeFilter
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-lg font-semibold">
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            What Our{" "}
            <span className="text-brand-teal">Community</span> Says
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real stories from seekers who found expert guidance and consultants 
            who built successful practices on Consultant Space.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
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

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.key)}
                className="bg-brand-teal hover:bg-brand-teal/90"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.category === "seeker" ? "Seeker" : "Consultant"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="h-3 w-3" />
                          {testimonial.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          {testimonial.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.rating}.0 rating
                    </span>
                  </div>

                  {/* Domain Badge */}
                  <Badge variant="secondary" className="w-fit">
                    {testimonial.domain}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <FiMessageSquare className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Additional Info */}
                  {testimonial.category === "seeker" && (
                    <div className="bg-brand-teal/5 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Consultant:</span> {testimonial.consultant}
                      </p>
                    </div>
                  )}

                  {testimonial.category === "consultant" && (
                    <div className="bg-brand-red/5 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-foreground">Total Earnings</p>
                          <p className="text-muted-foreground">{testimonial.earnings}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Sessions Completed</p>
                          <p className="text-muted-foreground">{testimonial.sessions}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
            Join Our Success Stories
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're seeking expert guidance or want to share your expertise, 
            Consultant Space is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/public/search"
              className="bg-white text-brand-teal px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Your Expert
            </a>
            <a
              href="/signup/consultant"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-teal transition-colors"
            >
              Become a Consultant
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
