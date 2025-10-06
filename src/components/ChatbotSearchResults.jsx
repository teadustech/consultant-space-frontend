import React from 'react';
import { Star, Clock, DollarSign } from 'lucide-react';

const ChatbotSearchResults = ({ results, onBookConsultant, onViewProfile }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="text-sm font-medium text-brand-teal mb-2">
        Search Results:
      </div>
      {results.slice(0, 3).map((consultant) => (
        <div
          key={consultant._id}
          className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-foreground">{consultant.fullName}</h4>
              <p className="text-sm text-muted-foreground">{consultant.domain}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} />
              <span className="text-sm">{consultant.rating || 'New'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{consultant.experience} years</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={12} />
              <span>₹{consultant.hourlyRate}/hr</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onBookConsultant(consultant._id)}
              className="flex-1 bg-brand-teal text-white text-xs py-1 px-2 rounded hover:bg-brand-teal-dark transition"
            >
              Book Now
            </button>
            <button
              onClick={() => onViewProfile(consultant._id)}
              className="flex-1 bg-muted text-foreground text-xs py-1 px-2 rounded hover:bg-muted/80 transition"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatbotSearchResults; 