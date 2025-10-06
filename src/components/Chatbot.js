import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { consultantService } from '../services/consultantService';
import { parseSearchQuery, extractSearchIntent } from '../utils/searchUtils';
import ChatbotSearchResults from './ChatbotSearchResults';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help you learn about The Consultant platform, our services, how to sign up, and answer any questions you might have. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: [
        { text: "What is The Consultant?", action: "what is the consultant" },
        { text: "How does it work?", action: "how does it work" },
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Knowledge base for the chatbot
  const knowledgeBase = {
    'what is the consultant': {
      response: "The Consultant is a platform that connects seekers with expert professionals across various domains including Software Development, Finance, Law, Marketing, and more. We bridge the gap between people who need expert advice and qualified consultants who can provide it.",
      keywords: ['what is', 'platform', 'connect', 'experts', 'consultants'],
      quickActions: [
        { text: "How does it work?", action: "how does it work" },
        { text: "What domains do you cover?", action: "domains" },
        { text: "What are the features?", action: "features" }
      ]
    },
    'how does it work': {
      response: "Here's how The Consultant works:\n\n1. **For Seekers**: Sign up, browse consultants by domain, view their profiles and expertise, and connect with them for consultations.\n\n2. **For Consultants**: Create a profile showcasing your expertise, set your rates, and get matched with seekers who need your services.\n\n3. **The Process**: Browse → Connect → Consult → Get Results",
      keywords: ['how', 'work', 'process', 'steps', 'procedure'],
      quickActions: [
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" },
        { text: "Learn about pricing", action: "pricing" }
      ]
    },
    'sign up': {
      response: "You can sign up in two ways:\n\n**As a Seeker**: If you need expert advice or consultation services\n**As a Consultant**: If you're a professional looking to offer your expertise\n\nClick the 'Join as Seeker' or 'Join as Consultant' buttons on our homepage to get started!",
      keywords: ['sign up', 'register', 'join', 'create account', 'signup'],
      quickActions: [
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" },
        { text: "Go to Login", action: "login" }
      ]
    },
    'sign up seeker': {
      response: "Great choice! To sign up as a seeker, you'll need to provide:\n\n• Full Name\n• Email Address\n• Phone Number\n• Password\n\nThis will allow you to browse and connect with expert consultants in your area of need.",
      keywords: ['sign up seeker', 'seeker registration', 'join as seeker'],
      quickActions: [
        { text: "Go to Seeker Signup", action: "navigate_seeker_signup" },
        { text: "Learn about domains", action: "domains" },
        { text: "How does it work?", action: "how does it work" }
      ]
    },
    'sign up consultant': {
      response: "Excellent! To sign up as a consultant, you'll need to provide:\n\n• Full Name\n• Email Address\n• Phone Number\n• Domain/Expertise Area\n• Years of Experience\n• Hourly Rate\n• Password\n\nThis will help seekers find and connect with you based on your expertise.",
      keywords: ['sign up consultant', 'consultant registration', 'join as consultant'],
      quickActions: [
        { text: "Go to Consultant Signup", action: "navigate_consultant_signup" },
        { text: "Learn about pricing", action: "pricing" },
        { text: "What domains are available?", action: "domains" }
      ]
    },
    'login': {
      response: "To log in to your account:\n\n1. Click the 'Login' button in the header\n2. Choose whether you're a Seeker or Consultant\n3. Enter your email and password\n4. Click 'Sign In'\n\nIf you don't have an account yet, you can sign up first!",
      keywords: ['login', 'sign in', 'log in', 'access account'],
      quickActions: [
        { text: "Go to Login", action: "navigate_login" },
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" }
      ]
    },
    'domains': {
      response: "We offer consultants across various professional domains:\n\n• Software Development & IT\n• Finance & Accounting\n• Legal Services\n• Marketing & Advertising\n• Business Strategy\n• Healthcare Consulting\n• Education & Training\n• And many more!\n\nYou can browse consultants by their specific expertise areas.",
      keywords: ['domains', 'categories', 'services', 'expertise', 'areas', 'fields'],
      quickActions: [
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" },
        { text: "How does it work?", action: "how does it work" }
      ]
    },
    'pricing': {
      response: "Pricing varies by consultant and service type. Each consultant sets their own rates based on their expertise and experience. You can view individual consultant rates on their profiles before connecting with them.",
      keywords: ['pricing', 'cost', 'rates', 'price', 'fee', 'how much'],
      quickActions: [
        { text: "Sign up as Seeker", action: "sign up seeker" },
        { text: "Sign up as Consultant", action: "sign up consultant" },
        { text: "Contact Support", action: "contact" }
      ]
    },
    'contact': {
      response: "You can reach us through:\n\n• Email: support@theconsultant.com\n• Phone: +1 (555) 123-4567\n• Live Chat: Right here! (I'm available 24/7)\n\nWe're here to help with any questions or support you need!",
      keywords: ['contact', 'support', 'help', 'email', 'phone', 'reach'],
      quickActions: [
        { text: "Learn about features", action: "features" },
        { text: "How does it work?", action: "how does it work" },
        { text: "Go to Homepage", action: "navigate_home" }
      ]
    },
    'features': {
      response: "Key features of The Consultant platform:\n\n• **Expert Matching**: Find consultants based on your specific needs\n• **Secure Communication**: Safe and private consultation channels\n• **Profile Verification**: All consultants are verified professionals\n• **Flexible Scheduling**: Book consultations at your convenience\n• **Payment Protection**: Secure payment processing\n• **Reviews & Ratings**: Make informed decisions based on feedback",
      keywords: ['features', 'benefits', 'what can', 'capabilities', 'offerings'],
      quickActions: [
        { text: "How does it work?", action: "how does it work" },
        { text: "Learn about domains", action: "domains" },
        { text: "Sign up now", action: "sign up" }
      ]
    },
    'find consultant': {
      response: "I can help you find the perfect consultant! Please tell me:\n\n• What type of expertise you need (e.g., software, finance, law)\n• Any specific requirements or budget\n• Your preferred experience level\n\nJust describe what you're looking for and I'll search for matching consultants.",
      keywords: ['find', 'search', 'consultant', 'expert', 'help', 'need'],
      quickActions: [
        { text: "Software Development", action: "search_software" },
        { text: "Finance & Accounting", action: "search_finance" },
        { text: "Legal Services", action: "search_legal" },
        { text: "Marketing", action: "search_marketing" }
      ]
    },
    'search_software': {
      response: "Searching for Software Development consultants...",
      keywords: ['software', 'development', 'programming', 'coding', 'tech'],
      action: 'performSearch',
      searchParams: { domain: 'Software' }
    },
    'search_finance': {
      response: "Searching for Finance & Accounting consultants...",
      keywords: ['finance', 'accounting', 'financial', 'money', 'tax'],
      action: 'performSearch',
      searchParams: { domain: 'Finance' }
    },
    'search_legal': {
      response: "Searching for Legal Services consultants...",
      keywords: ['legal', 'law', 'lawyer', 'attorney', 'legal advice'],
      action: 'performSearch',
      searchParams: { domain: 'Law' }
    },
    'search_marketing': {
      response: "Searching for Marketing consultants...",
      keywords: ['marketing', 'advertising', 'promotion', 'brand'],
      action: 'performSearch',
      searchParams: { domain: 'Marketing' }
    }
  };

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    // Check if it's a search query
    const searchIntent = extractSearchIntent(userInput);
    if (searchIntent) {
      return {
        action: 'performSearch',
        searchParams: searchIntent,
        response: `Searching for consultants matching: ${Object.entries(searchIntent).map(([k,v]) => `${k}: ${v}`).join(', ')}`
      };
    }

    Object.entries(knowledgeBase).forEach(([key, data]) => {
      const score = data.keywords.reduce((total, keyword) => {
        if (input.includes(keyword)) {
          return total + 1;
        }
        return total;
      }, 0);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = key;
      }
    });

    return highestScore > 0 ? knowledgeBase[bestMatch] : null;
  };

  // New function to perform consultant search
  const performConsultantSearch = async (searchParams) => {
    setIsSearching(true);
    try {
      const results = await consultantService.searchConsultants(searchParams);
      setSearchResults(results);
      
      if (results.length === 0) {
        return {
          text: "I couldn't find any consultants matching your criteria. Try:\n\n• Broadening your search terms\n• Checking different domains\n• Adjusting your budget range\n\nWould you like to search in a different domain?",
          quickActions: [
            { text: "Search Software", action: "search_software" },
            { text: "Search Finance", action: "search_finance" },
            { text: "Search Legal", action: "search_legal" },
            { text: "Search Marketing", action: "search_marketing" }
          ]
        };
      }
      
      return {
        text: `I found ${results.length} consultant(s) matching your criteria:\n\n${results.slice(0, 3).map((consultant, index) => 
          `${index + 1}. **${consultant.fullName}** (${consultant.domain})\n   • Experience: ${consultant.experience} years\n   • Rate: ₹${consultant.hourlyRate}/hour\n   • Rating: ${consultant.rating || 'New'} ⭐`
        ).join('\n\n')}${results.length > 3 ? `\n\n...and ${results.length - 3} more consultants.` : ''}`,
        quickActions: [
          { text: "View All Results", action: "view_all_results" },
          { text: "Book Top Consultant", action: `book_consultant_${results[0]._id}` },
          { text: "Refine Search", action: "refine_search" }
        ],
        searchResults: results
      };
    } catch (error) {
      return {
        text: "Sorry, I encountered an error while searching. Please try again or contact support if the issue persists.",
        quickActions: [
          { text: "Try Again", action: "find consultant" },
          { text: "Contact Support", action: "contact" }
        ]
      };
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickAction = async (action) => {
    // Handle navigation actions
    if (action.startsWith('navigate_')) {
      const route = action.replace('navigate_', '');
      switch (route) {
        case 'home':
          navigate('/');
          break;
        case 'login':
          navigate('/login');
          break;
        case 'seeker_signup':
          navigate('/signup/seeker');
          break;
        case 'consultant_signup':
          navigate('/signup/consultant');
          break;
        default:
          break;
      }
      setIsOpen(false);
      return;
    }

    if (action.startsWith('search_')) {
      const searchParams = knowledgeBase[action]?.searchParams;
      if (searchParams) {
        const searchResponse = await performConsultantSearch(searchParams);
        const botMessage = {
          id: messages.length + 1,
          text: searchResponse.text,
          sender: 'bot',
          timestamp: new Date(),
          quickActions: searchResponse.quickActions,
          searchResults: searchResponse.searchResults
        };
        setMessages(prev => [...prev, botMessage]);
      }
      return;
    }

    if (action.startsWith('book_consultant_')) {
      const consultantId = action.replace('book_consultant_', '');
      navigate(`/consultant/${consultantId}/book`);
      setIsOpen(false);
      return;
    }

    if (action === 'view_all_results') {
      navigate('/consultants', { state: { searchResults } });
      setIsOpen(false);
      return;
    }

    // Handle regular actions
    const response = findBestMatch(action);
    if (response) {
      const botMessage = {
        id: messages.length + 1,
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        quickActions: response.quickActions
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const getFallbackResponse = () => {
    const fallbacks = [
      "I'm not sure I understand. Could you rephrase that? I can help you with information about our platform, services, how to sign up, or general questions.",
      "I don't have specific information about that, but I can help you with:\n• Platform overview\n• How to sign up\n• Available services\n• Contact information\n\nWhat would you like to know?",
      "That's a great question! While I don't have the exact answer, I can help you find the right consultant or guide you through our platform. What specific area are you interested in?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const response = findBestMatch(inputValue);
      let botMessage;

      if (response && response.action === 'performSearch') {
        // Handle search action
        const searchResponse = await performConsultantSearch(response.searchParams);
        botMessage = {
          id: messages.length + 2,
          text: searchResponse.text,
          sender: 'bot',
          timestamp: new Date(),
          quickActions: searchResponse.quickActions,
          searchResults: searchResponse.searchResults
        };
      } else {
        // Handle regular responses
        const responseText = response ? response.response : getFallbackResponse();
        botMessage = {
          id: messages.length + 2,
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
          quickActions: response ? response.quickActions : undefined
        };
      }

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brand-teal hover:bg-brand-teal-dark text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-background border border-border rounded-lg shadow-xl flex flex-col">
          {/* Chat Header */}
          <div className="bg-brand-teal text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-brand-teal text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    <div className="whitespace-pre-line">{message.text}</div>
                    {message.sender === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {/* Quick Action Buttons */}
                  {message.sender === 'bot' && message.quickActions && (
                    <div className="mt-3 space-y-2">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.action)}
                          className="block w-full text-left px-3 py-2 text-sm bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal rounded-md transition-colors"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search Results Display */}
                  {message.searchResults && (
                    <ChatbotSearchResults
                      results={message.searchResults}
                      onBookConsultant={(consultantId) => handleQuickAction(`book_consultant_${consultantId}`)}
                      onViewProfile={(consultantId) => navigate(`/consultant/${consultantId}/profile`)}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-background text-foreground"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-brand-teal hover:bg-brand-teal-dark disabled:bg-muted disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 