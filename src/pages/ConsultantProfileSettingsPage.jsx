import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConsultantProfileSettings from "../components/ConsultantProfileSettings";

export default function ConsultantProfileSettingsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-brand-teal/5 via-brand-teal/10 to-brand-red/5 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Consultant Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your dedicated profile page and manage your services
            </p>
          </div>
          
          <ConsultantProfileSettings />
        </div>
      </div>
      <Footer />
    </>
  );
}
