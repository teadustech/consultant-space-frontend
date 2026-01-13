import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiShield, 
  FiEye, 
  FiLock, 
  FiUser,
  FiDatabase,
  FiGlobe,
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText
} from "react-icons/fi";

export default function Privacy() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      title: "1. Information We Collect",
      content: `Teadustech Pvt Ltd (operating as Consultant Space) collects information you provide directly to us, such as when you create an account, book a consultation, or contact us. This includes your name, email address, phone number, payment information, and any other information you choose to provide.`,
      icon: FiUser,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.`,
      icon: FiDatabase,
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform.`,
      icon: FiShield,
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`,
      icon: FiLock,
    },
    {
      title: "5. Data Retention",
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. We will delete or anonymize your information when it is no longer needed.`,
      icon: FiDatabase,
    },
    {
      title: "6. Your Rights and Choices",
      content: `You have the right to access, update, or delete your personal information. You can also opt out of certain communications and control how we use your information through your account settings.`,
      icon: FiEye,
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser.`,
      icon: FiGlobe,
    },
    {
      title: "8. Third-Party Services",
      content: `Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.`,
      icon: FiGlobe,
    },
    {
      title: "9. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.`,
      icon: FiGlobe,
    },
    {
      title: "10. Children's Privacy",
      content: `Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.`,
      icon: FiUser,
    },
    {
      title: "11. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`,
      icon: FiFileText,
    },
    {
      title: "12. Contact Us",
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@theconsultant.com or call us at +91 98765 43210. Teadustech Pvt Ltd is the legal entity responsible for data processing.`,
      icon: FiShield,
    },
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      examples: ["Name", "Email address", "Phone number", "Profile picture"],
      purpose: "Account creation and identification",
    },
    {
      category: "Payment Information",
      examples: ["Credit card details", "UPI information", "Billing address"],
      purpose: "Processing payments and transactions",
    },
    {
      category: "Usage Data",
      examples: ["Session logs", "Search queries", "Booking history"],
      purpose: "Improving platform functionality",
    },
    {
      category: "Communication Data",
      examples: ["Messages with consultants", "Support tickets", "Feedback"],
      purpose: "Providing customer support",
    },
  ];

  const securityMeasures = [
    "End-to-end encryption for all communications",
    "Secure payment processing with PCI DSS compliance",
    "Regular security audits and vulnerability assessments",
    "Two-factor authentication for account protection",
    "Data backup and disaster recovery procedures",
    "Employee training on data protection practices",
  ];

  const userRights = [
    "Access your personal information",
    "Update or correct your data",
    "Delete your account and data",
    "Export your data in a portable format",
    "Opt out of marketing communications",
    "Request data processing restrictions",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-teal/10 to-brand-red/10 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Data Protection
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Privacy{" "}
            <span className="text-brand-teal">Policy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We are committed to protecting your privacy and ensuring the security 
            of your personal information on Consultant Space platform.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <FiFileText className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Commitment Notice */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="border-l-4 border-l-brand-teal bg-brand-teal/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <FiShield className="h-6 w-6 text-brand-teal mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Our Commitment to Privacy
                  </h3>
                  <p className="text-muted-foreground">
                    At Consultant Space, we believe your privacy is fundamental. This policy explains how we collect, 
                    use, and protect your personal information. We are committed to transparency and giving you 
                    control over your data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Types We Collect */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Information We Collect
            </h2>
            <p className="text-lg text-muted-foreground">
              We collect only the information necessary to provide our services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {dataTypes.map((dataType, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    {dataType.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {dataType.examples.map((example, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <FiCheckCircle className="h-4 w-4 text-brand-teal" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Purpose:</h4>
                    <p className="text-muted-foreground">{dataType.purpose}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Sections */}
      <section className="py-20 bg-muted/30">
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

      {/* Security Measures */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How We Protect Your Data
            </h2>
            <p className="text-lg text-muted-foreground">
              We implement industry-standard security measures to keep your information safe
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <FiLock className="h-5 w-5 text-brand-teal mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{measure}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Your Privacy Rights
            </h2>
            <p className="text-lg text-muted-foreground">
              You have control over your personal information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <FiEye className="h-5 w-5 text-brand-teal mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{right}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Privacy */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-teal/5 to-brand-red/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or want to exercise 
                your privacy rights, please contact our privacy team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@theconsultant.com"
                  className="bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal/90 transition-colors"
                >
                  Email Privacy Team
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
            This Privacy Policy is part of Teadustech Pvt Ltd's commitment to transparency and data protection. 
            We regularly review and update this policy to ensure compliance with applicable laws 
            and best practices.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
