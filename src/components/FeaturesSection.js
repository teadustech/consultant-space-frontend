import React from "react";
import { FaUserCheck, FaLock, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";

const features = [
  {
    icon: <FaUserCheck className="text-3xl text-brand-teal mb-2" />,
    title: "Verified Professionals",
    desc: "All consultants are vetted for expertise and reliability."
  },
  {
    icon: <FaLock className="text-3xl text-brand-teal mb-2" />,
    title: "Secure Payments",
    desc: "Your transactions are encrypted and protected."
  },
  {
    icon: <FaCalendarAlt className="text-3xl text-brand-teal mb-2" />,
    title: "Flexible Scheduling",
    desc: "Book sessions at times that work for you."
  },
  {
    icon: <FaLayerGroup className="text-3xl text-brand-teal mb-2" />,
    title: "Multi-Domain Expertise",
    desc: "Find consultants in software, finance, law, and more."
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-teal/5 to-brand-teal/10" id="features">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Why Choose Consultant Space?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-card rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-all border border-brand-teal/10">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 text-card-foreground text-center">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 