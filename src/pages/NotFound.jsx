import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-brand-teal mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <FiHome className="h-4 w-4" />
              Go Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <FiArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
