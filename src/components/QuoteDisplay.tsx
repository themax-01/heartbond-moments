
import React, { useState } from 'react';
import { useBond } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { Quote as QuoteIcon, Sparkles, RefreshCw } from 'lucide-react';

interface QuoteDisplayProps {
  className?: string;
}

const DEFAULT_QUOTES = [
  "Love is not about how many days, months, or years you have been together. It's all about how much you love each other every day.",
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "The best thing to hold onto in life is each other.",
  "You are my today and all of my tomorrows.",
  "To love and be loved is to feel the sun from both sides.",
  "You don't love someone for their looks, or their clothes, or for their fancy car, but because they sing a song only you can hear."
];

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ className }) => {
  const { quote, setQuote, currentTheme } = useBond();
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState(quote);
  
  const themeClasses = {
    spring: "bg-spring-secondary/70 text-spring-accent",
    summer: "bg-summer-secondary/70 text-summer-accent",
    autumn: "bg-autumn-secondary/70 text-autumn-accent",
    winter: "bg-winter-secondary/70 text-winter-accent",
    blossom: "bg-blossom-secondary/70 text-blossom-accent",
  };

  const handleSaveQuote = () => {
    setQuote(editedQuote);
    setIsEditing(false);
  };

  const handleRandomQuote = () => {
    let newQuote;
    do {
      const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
      newQuote = DEFAULT_QUOTES[randomIndex];
    } while (newQuote === quote);
    
    setQuote(newQuote);
    setEditedQuote(newQuote);
  };

  return (
    <div className={cn(
      "glass-effect rounded-xl p-5 transition-all duration-300 max-w-md w-full",
      themeClasses[currentTheme],
      className
    )}>
      <div className="flex items-center mb-3 justify-between">
        <div className="flex items-center">
          <QuoteIcon size={16} className="mr-2" />
          <h3 className="font-medium">Quote of the Moment</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRandomQuote}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Get random quote"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={() => {
              if (isEditing) {
                handleSaveQuote();
              } else {
                setIsEditing(true);
                setEditedQuote(quote);
              }
            }}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isEditing ? "Save quote" : "Edit quote"}
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <textarea 
            value={editedQuote}
            onChange={(e) => setEditedQuote(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-white/50 min-h-[100px]"
            placeholder="Enter your quote..."
          />
          <div className="flex justify-end mt-2 gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveQuote}
              className="px-3 py-1 rounded-lg bg-white/30 hover:bg-white/40 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 italic text-center">
          "{quote}"
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;
