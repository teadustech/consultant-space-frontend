import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedConsultantsSection from "../components/FeaturedConsultantsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedConsultantsSection />
        <HowItWorksSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}