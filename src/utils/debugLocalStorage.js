// Utility function to debug localStorage data
export const debugLocalStorage = () => {
  console.log('=== localStorage Debug ===');
  
  // Check consultantProfileData
  const consultantProfileData = localStorage.getItem('consultantProfileData');
  console.log('consultantProfileData:', consultantProfileData ? JSON.parse(consultantProfileData) : 'Not found');
  
  // Check allConsultantProfiles
  const allConsultantProfiles = localStorage.getItem('allConsultantProfiles');
  console.log('allConsultantProfiles:', allConsultantProfiles ? JSON.parse(allConsultantProfiles) : 'Not found');
  
  // Check userData
  const userData = localStorage.getItem('userData');
  console.log('userData:', userData ? JSON.parse(userData) : 'Not found');
  
  // Check userType
  const userType = localStorage.getItem('userType');
  console.log('userType:', userType);
  
  console.log('=== End Debug ===');
};

// Function to clear all consultant profile data
export const clearConsultantProfiles = () => {
  localStorage.removeItem('consultantProfileData');
  localStorage.removeItem('allConsultantProfiles');
  console.log('Cleared all consultant profile data');
};

// Function to get all consultant profiles
export const getAllConsultantProfiles = () => {
  const allProfiles = localStorage.getItem('allConsultantProfiles');
  return allProfiles ? JSON.parse(allProfiles) : {};
};

// Function to get a specific consultant profile by username
export const getConsultantProfile = (username) => {
  const allProfiles = getAllConsultantProfiles();
  return allProfiles[username] || null;
};
