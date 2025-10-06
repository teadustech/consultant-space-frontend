import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiShield, 
  FiUsers, 
  FiDollarSign, 
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText
} from "react-icons/fi";

export default function Terms() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using The Consultant platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
      icon: FiCheckCircle,
    },
    {
      title: "2. Description of Service",
      content: `The Consultant is a platform that connects seekers with verified consultants across various domains including but not limited to business strategy, software development, digital marketing, human resources, finance, and legal services.`,
      icon: FiUsers,
    },
    {
      title: "3. User Accounts and Registration",
      content: `To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.`,
      icon: FiShield,
    },
    {
      title: "4. Consultant Verification",
      content: `All consultants on our platform undergo a verification process. However, we do not guarantee the accuracy of consultant credentials or the quality of services provided. Users should exercise their own judgment when selecting consultants.`,
      icon: FiCheckCircle,
    },
    {
      title: "5. Booking and Payment Terms",
      content: `All bookings are subject to consultant availability. Payment is processed securely through our platform. Cancellation policies vary by consultant and are clearly stated during the booking process.`,
      icon: FiDollarSign,
    },
    {
      title: "6. User Conduct",
      content: `Users agree not to use the Service for any unlawful purpose or to solicit others to perform unlawful acts. Users must not harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.`,
      icon: FiAlertTriangle,
    },
    {
      title: "7. Intellectual Property Rights",
      content: `The Service and its original content, features, and functionality are and will remain the exclusive property of Teadustech Pvt Ltd (operating as The Consultant) and its licensors. The Service is protected by copyright, trademark, and other laws.`,
      icon: FiFileText,
    },
    {
      title: "8. Privacy Policy",
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.`,
      icon: FiShield,
    },
    {
      title: "9. Disclaimers",
      content: `The information on this Service is provided on an "as is" basis. The Consultant does not warrant that the Service will be uninterrupted or error-free, nor does it make any warranty as to the results that may be obtained from use of the Service.`,
      icon: FiAlertTriangle,
    },
    {
      title: "10. Limitation of Liability",
      content: `In no event shall The Consultant, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`,
      icon: FiAlertTriangle,
    },
    {
      title: "11. Indemnification",
      content: `You agree to defend, indemnify, and hold harmless The Consultant and its licensees and service providers from any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms.`,
      icon: FiShield,
    },
    {
      title: "12. Termination",
      content: `We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.`,
      icon: FiAlertTriangle,
    },
    {
      title: "13. Governing Law",
      content: `These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
      icon: FiFileText,
    },
    {
      title: "14. Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.`,
      icon: FiFileText,
    },
    {
      title: "15. Contact Information",
      content: `If you have any questions about these Terms, please contact us at legal@theconsultant.com or call us at +91 98765 43210. Teadustech Pvt Ltd is the legal entity operating The Consultant platform.`,
      icon: FiUsers,
    },
  ];

  const importantNotes = [
    "All payments are processed securely through our platform",
    "Consultant verification does not guarantee service quality",
    "Cancellation policies vary by consultant",
    "We reserve the right to modify these terms at any time",
    "Users must comply with all applicable laws and regulations",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Legal Information
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Terms of{" "}
            <span className="text-brand-teal">Service</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Please read these terms and conditions carefully before using 
            The Consultant platform.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <FiFileText className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="border-l-4 border-l-brand-red bg-brand-red/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FiAlertTriangle className="h-6 w-6 text-brand-red mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Important Notice
                  </h3>
                  <p className="text-muted-foreground">
                    By using The Consultant platform, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms of Service. If you do 
                    not agree to these terms, please do not use our platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-brand-teal/10 rounded-full">
                      <section.icon className="h-6 w-6 text-brand-teal" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground">
                        {section.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Key Points to Remember
            </h2>
            <p className="text-lg text-muted-foreground">
              Important information about using The Consultant platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {importantNotes.map((note, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <FiCheckCircle className="h-5 w-5 text-brand-teal mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Legal */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-teal/5 to-brand-red/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions or concerns about these Terms of Service, 
                please don't hesitate to contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:legal@theconsultant.com"
                  className="bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal/90 transition-colors"
                >
                  Email Legal Team
                </a>
                <a
                  href="tel:+919876543210"
                  className="bg-transparent border-2 border-brand-teal text-brand-teal px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal hover:text-white transition-colors"
                >
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            These Terms of Service constitute the entire agreement between you and Teadustech Pvt Ltd 
            (operating as The Consultant) regarding the use of our platform. Any changes to these terms will be posted on this page.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
