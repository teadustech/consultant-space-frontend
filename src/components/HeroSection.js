import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiSearch } from "react-icons/fi";
import logo from "../assets/logo.png";

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/consultants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-20 flex items-center justify-center min-h-[60vh] overflow-hidden">
      {/* Faint logo watermark */}
      <img
        src={logo}
        alt="Logo Watermark"
        className="absolute opacity-10 w-2/3 max-w-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      />
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Where Questions Meet the Right Answers.
        </h1>
        <p className="text-lg md:text-xl text-black dark:text-white mb-8">
          We bridge seekers and specialists, ensuring you get expert advice when it matters most.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for consultants, expertise, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-brand-teal hover:bg-brand-teal/90 px-6 py-3"
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </div>
        </form>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup/seeker" className="bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-brand-teal-dark transition">
            Join as Seeker
          </Link>
          <Link to="/signup/consultant" className="bg-background border border-brand-teal text-brand-teal px-6 py-3 rounded-lg font-semibold shadow hover:bg-brand-teal/10 transition">
            Join as Consultant
          </Link>
        </div>
      </div>
    </section>
  );
} 