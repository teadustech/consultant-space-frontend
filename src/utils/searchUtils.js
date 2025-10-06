export const parseSearchQuery = (query) => {
  const input = query.toLowerCase();
  const searchParams = {};

  // Domain detection
  const domainKeywords = {
    'Software': ['software', 'programming', 'coding', 'development', 'tech', 'it', 'computer', 'app', 'website', 'mobile'],
    'Finance': ['finance', 'financial', 'accounting', 'money', 'tax', 'investment', 'banking', 'budget', 'expense'],
    'Law': ['law', 'legal', 'lawyer', 'attorney', 'legal advice', 'contract', 'legal', 'court', 'litigation'],
    'Marketing': ['marketing', 'advertising', 'promotion', 'brand', 'social media', 'digital marketing', 'seo', 'content'],
    'HR': ['hr', 'human resources', 'recruitment', 'hiring', 'employee', 'personnel', 'workforce', 'talent'],
    'Admin': ['admin', 'administrative', 'office', 'management', 'coordination', 'organization', 'planning']
  };

  Object.entries(domainKeywords).forEach(([domain, keywords]) => {
    if (keywords.some(keyword => input.includes(keyword))) {
      searchParams.domain = domain;
    }
  });

  // Price range detection
  const priceMatch = input.match(/(\d+)\s*(?:rs|rupees?|₹|inr)/i);
  if (priceMatch) {
    searchParams.maxPrice = parseInt(priceMatch[1]);
  }

  // Experience level detection
  if (input.includes('senior') || input.includes('experienced') || input.includes('expert')) {
    searchParams.minExperience = 5;
  } else if (input.includes('junior') || input.includes('fresher') || input.includes('beginner')) {
    searchParams.maxExperience = 2;
  }

  // Rating detection
  if (input.includes('highly rated') || input.includes('top rated') || input.includes('best')) {
    searchParams.minRating = 4;
  }

  return searchParams;
};

export const extractSearchIntent = (query) => {
  const input = query.toLowerCase();
  
  // Check for search intent keywords
  const searchKeywords = ['find', 'search', 'need', 'looking for', 'want', 'help with', 'consultant for'];
  const hasSearchIntent = searchKeywords.some(keyword => input.includes(keyword));
  
  if (hasSearchIntent) {
    return parseSearchQuery(query);
  }
  
  return null;
}; 