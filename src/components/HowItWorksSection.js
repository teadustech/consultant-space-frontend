import React from "react";
import { FaUserPlus, FaCalendarCheck, FaCommentsDollar } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus className="text-4xl text-brand-teal mb-2" />,
    title: "Sign up as a Seeker or Consultant",
    desc: "Create your account and set up your profile."
  },
  {
    icon: <FaCalendarCheck className="text-4xl text-brand-teal mb-2" />,
    title: "Book a session or list your availability",
    desc: "Seekers book sessions, consultants set their schedule."
  },
  {
    icon: <FaCommentsDollar className="text-4xl text-brand-teal mb-2" />,
    title: "Connect securely and pay through the app",
    desc: "Meet, consult, and transact all in one place."
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-teal/5 to-brand-red/5" id="how-it-works">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center text-center px-4 relative">
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-1 bg-brand-teal/20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 