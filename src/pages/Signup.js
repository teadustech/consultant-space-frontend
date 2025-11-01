import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { User, UserCheck } from "lucide-react";

export default function Signup() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-2">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center">
              Select how you'd like to use Consultant Space
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Seeker Card */}
            <Link 
              to="/signup/seeker"
              className="group block bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal rounded-full mb-4 group-hover:bg-brand-teal-dark transition-colors">
                  <User className="text-2xl text-white" />
                </div>
                                  <h3 className="text-xl font-semibold mb-3 text-gray-800">I'm a Seeker</h3>
                  <p className="text-muted-foreground mb-4">
                    I need expert consultation and advice from professionals
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Find and book expert consultants</li>
                  <li>• Get professional advice</li>
                  <li>• Secure payment system</li>
                </ul>
                <div className="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium group-hover:bg-brand-teal-dark transition-colors">
                  Sign Up as Seeker
                </div>
              </div>
            </Link>

            {/* Consultant Card */}
            <Link 
              to="/signup/consultant"
              className="group block bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border-2 border-transparent hover:border-teal-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal rounded-full mb-4 group-hover:bg-brand-teal-dark transition-colors">
                  <UserCheck className="text-2xl text-white" />
                </div>
                                  <h3 className="text-xl font-semibold mb-3 text-gray-800">I'm a Consultant</h3>
                  <p className="text-muted-foreground mb-4">
                    I'm a professional offering consultation services
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Set your hourly rates</li>
                  <li>• Manage your schedule</li>
                  <li>• Earn from consultations</li>
                </ul>
                <div className="bg-brand-teal text-white px-4 py-2 rounded-lg font-medium group-hover:bg-brand-teal-dark transition-colors">
                  Sign Up as Consultant
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-brand-teal hover:underline font-medium">Log in</Link>
          </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 