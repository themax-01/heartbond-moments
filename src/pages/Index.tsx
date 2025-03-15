
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import HeartAnimation from '@/components/HeartAnimation';
import { cn } from '@/lib/utils';
import ThemeElements from '@/components/ThemeElements';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { hasBond, currentTheme } = useBond();

  useEffect(() => {
    // If bond exists, automatically navigate to the bond page
    if (hasBond) {
      const timer = setTimeout(() => {
        navigate('/bond');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [hasBond, navigate]);

  const themeClasses = {
    spring: "bg-gradient-to-b from-spring-primary to-spring-secondary",
    summer: "bg-gradient-to-b from-summer-primary to-summer-secondary",
    autumn: "bg-gradient-to-b from-autumn-primary to-autumn-secondary",
    winter: "bg-gradient-to-b from-winter-primary to-winter-secondary",
    blossom: "bg-gradient-to-b from-blossom-primary to-blossom-secondary",
  };

  const buttonClasses = {
    spring: "bg-spring-highlight hover:bg-spring-accent text-white",
    summer: "bg-summer-highlight hover:bg-summer-accent text-white",
    autumn: "bg-autumn-highlight hover:bg-autumn-accent text-white",
    winter: "bg-winter-highlight hover:bg-winter-accent text-winter-primary",
    blossom: "bg-blossom-highlight hover:bg-blossom-accent text-white",
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden",
      themeClasses[currentTheme]
    )}>
      <ThemeElements />
      
      <div className="text-center z-10 animate-fade-in max-w-md">
        <HeartAnimation size={150} className="mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold mb-3">HeartBond</h1>
        <p className="mb-8 opacity-80">
          Connect with your loved one and share your moments, feelings, and plans in a beautiful way.
        </p>
        
        {hasBond ? (
          <div className="glass-effect p-6 rounded-xl">
            <p className="mb-4">Welcome back! Redirecting you to your bond...</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        ) : (
          <div className="glass-effect p-6 rounded-xl">
            <p className="mb-6">
              Create a special connection with someone you care about, and stay in sync with their feelings, activities and plans.
            </p>
            <button
              onClick={() => navigate('/create')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all",
                buttonClasses[currentTheme]
              )}
            >
              Create a Bond
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
