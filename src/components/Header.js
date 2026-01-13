import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { ThemeToggle } from "./ui/theme-toggle";
import logo from "../assets/logo.png";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/about" },
  { name: "Testimonials", to: "/testimonials" },
  { name: "How It Works", to: "/", isAnchor: true, anchorId: "how-it-works" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    const storedUserData = localStorage.getItem('userData');

    if (token && storedUserType && storedUserData) {
      setUserType(storedUserType);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setUserData(null);
    setUserType(null);
    navigate('/');
  };

  // Get navigation links based on user type
  const getNavLinks = () => {
    const links = [...navLinks];
    
    // Add "Find Consultants" only for seekers
    if (userType === 'seeker') {
      links.splice(1, 0, { name: "Find Consultants", to: "/consultants" });
    }
    
    return links;
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="The Consultant Logo" className="h-16 w-24 md:h-20 md:w-30 object-contain" />
          <div className="block">
            <div className="font-bold text-base md:text-lg"><span className="text-brand-teal">Consultant </span> Space</div>
            <div className="text-xs text-muted-foreground font-medium"><b><span className="text-brand-teal">Your Go-</span>To Experts</b></div>
          </div>
        </Link>
        <nav className="hidden md:flex gap-8">
          {getNavLinks().map(link => (
            link.isAnchor ? (
              <button
                key={link.name}
                onClick={() => {
                  if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                      const element = document.getElementById(link.anchorId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  } else {
                    const element = document.getElementById(link.anchorId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="text-foreground hover:text-brand-teal font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.name}
              </button>
            ) : (
              <Link key={link.name} to={link.to} className="text-foreground hover:text-brand-teal font-medium transition-colors">
                {link.name}
              </Link>
            )
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {userData ? (
            <div className="flex items-center gap-4">
              <span className="text-foreground font-medium">
                Hi, {userData.fullName}
              </span>
              <Link 
                to="/dashboard" 
                className="text-foreground hover:text-brand-teal font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-foreground hover:text-red-500 font-medium transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-foreground hover:text-brand-teal font-medium transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-foreground hover:text-brand-teal font-medium transition-colors">
                Sign Up
              </Link>
            </div>
          )}
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg px-4 pb-4">
          <nav className="flex flex-col gap-4">
            {getNavLinks().map(link => (
              link.isAnchor ? (
                <button
                  key={link.name}
                  onClick={() => {
                    setMenuOpen(false);
                    if (window.location.pathname !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        const element = document.getElementById(link.anchorId);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    } else {
                      const element = document.getElementById(link.anchorId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className="text-foreground hover:text-brand-teal font-medium transition-colors bg-transparent border-none cursor-pointer text-left w-full"
                >
                  {link.name}
                </button>
              ) : (
                <Link key={link.name} to={link.to} className="text-foreground hover:text-brand-teal font-medium transition-colors" onClick={() => setMenuOpen(false)}>
                  {link.name}
                </Link>
              )
            ))}
            {userData ? (
              <>
                <div className="text-foreground font-medium py-2 border-t border-border">
                  Hi, {userData.fullName}
                </div>
                <Link 
                  to="/dashboard" 
                  className="text-foreground hover:text-brand-teal font-medium transition-colors" 
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-foreground hover:text-red-500 font-medium transition-colors text-left"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-foreground hover:text-brand-teal font-medium transition-colors" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="text-foreground hover:text-brand-teal font-medium transition-colors" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 