import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-brand-teal transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-brand-teal transition-colors">Contact</Link>
          <Link to="/about" className="hover:text-brand-teal transition-colors">About Us</Link>
        </div>
        <div className="text-xs text-muted-foreground text-center md:text-right">
          &copy; 2025 Teadustech Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 