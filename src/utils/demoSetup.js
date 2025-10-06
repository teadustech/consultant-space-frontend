// Demo setup utility for testing consultant profile feature
export const setupDemoData = () => {
  // Sample consultant profile data
  const demoConsultantProfile = {
    profileEnabled: true,
    username: "john-doe",
    fullName: "John Doe",
    tagline: "Expert Business Strategy Consultant",
    bio: "I help startups and businesses develop winning strategies that drive growth and success. With over 10 years of experience in business consulting, I've helped 100+ companies achieve their goals.",
    qualifications: "MBA from Harvard Business School\nCertified Business Strategy Professional\nFormer McKinsey Consultant",
    experience: "10+ years in business strategy consulting\nWorked with Fortune 500 companies\nSpecialized in startup growth strategies",
    expertise: ["Business Strategy", "Startup Growth", "Market Analysis", "Financial Planning"],
    services: [
      {
        id: 1,
        name: "Business Strategy Session",
        description: "Comprehensive business strategy consultation including market analysis, competitive positioning, and growth roadmap.",
        price: 2500,
        duration: "2 hours"
      },
      {
        id: 2,
        name: "Startup Growth Workshop",
        description: "Intensive workshop focused on scaling your startup, identifying growth opportunities, and building sustainable business models.",
        price: 5000,
        duration: "4 hours"
      },
      {
        id: 3,
        name: "Financial Planning Consultation",
        description: "Expert guidance on financial planning, budgeting, and investment strategies for your business.",
        price: 1500,
        duration: "1 hour"
      }
    ]
  };

  // Save to localStorage
  localStorage.setItem('consultantProfileData', JSON.stringify(demoConsultantProfile));
  
  // Also save to all profiles for public access
  const allProfiles = JSON.parse(localStorage.getItem('allConsultantProfiles') || '{}');
  allProfiles[demoConsultantProfile.username] = demoConsultantProfile;
  localStorage.setItem('allConsultantProfiles', JSON.stringify(allProfiles));

  console.log('Demo consultant profile data set up successfully!');
  console.log('Profile URL:', `${window.location.origin}/consultants/${demoConsultantProfile.username}`);
};

export const clearDemoData = () => {
  localStorage.removeItem('consultantProfileData');
  localStorage.removeItem('allConsultantProfiles');
  localStorage.removeItem('serviceBookings');
  localStorage.removeItem('consultantServiceBookings');
  console.log('Demo data cleared successfully!');
};

// Run this in browser console to set up demo data
// setupDemoData();
