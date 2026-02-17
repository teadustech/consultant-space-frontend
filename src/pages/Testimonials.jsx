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

  // Add real testimonials here when available. Each item: id, name, role, company, location, rating, category ("seeker"|"consultant"), domain, date, content, image; seekers need "consultant", consultants need "earnings", "sessions".
  const testimonials = [];

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

      {/* Testimonials Grid - add items to testimonials array to display */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.length === 0 ? (
              <p className="col-span-2 text-center text-muted-foreground py-12">
                Real testimonials will appear here. Add entries to the testimonials array when available.
              </p>
            ) : null}
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
