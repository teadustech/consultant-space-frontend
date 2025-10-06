import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TestRoute() {
  const { username } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Test Route Working! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            This confirms that the routing system is working correctly.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Route Parameters</h2>
            <p className="text-lg">
              <strong>Username:</strong> {username || "No username provided"}
            </p>
            <p className="text-lg">
              <strong>Current URL:</strong> {window.location.href}
            </p>
          </div>
          
          <div className="space-y-4">
            <Button onClick={() => navigate('/')} size="lg">
              Go Home
            </Button>
            <br />
            <Button 
              variant="outline" 
              onClick={() => navigate('/consultants')}
              size="lg"
            >
              Browse Consultants
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
