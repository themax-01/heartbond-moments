
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import HeartAnimation from '@/components/HeartAnimation';
import ThemeSelector from '@/components/ThemeSelector';
import StatusUpdate from '@/components/StatusUpdate';
import QuoteDisplay from '@/components/QuoteDisplay';
import BondCounter from '@/components/BondCounter';
import ThemeElements from '@/components/ThemeElements';
import { cn } from '@/lib/utils';
import { PanelRight, Settings } from 'lucide-react';

const Bond: React.FC = () => {
  const navigate = useNavigate();
  const { 
    bondName, 
    hasBond, 
    currentTheme,
    bondReason 
  } = useBond();
  
  const [showSettings, setShowSettings] = React.useState(false);

  // Redirect to create bond if no bond exists
  useEffect(() => {
    if (!hasBond) {
      navigate('/create');
    }
  }, [hasBond, navigate]);

  if (!hasBond) return null;

  const themeClasses = {
    spring: "bg-gradient-to-b from-spring-primary to-spring-secondary",
    summer: "bg-gradient-to-b from-summer-primary to-summer-secondary",
    autumn: "bg-gradient-to-b from-autumn-primary to-autumn-secondary",
    winter: "bg-gradient-to-b from-winter-primary to-winter-secondary",
    blossom: "bg-gradient-to-b from-blossom-primary to-blossom-secondary",
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 overflow-hidden relative",
      themeClasses[currentTheme]
    )}>
      <ThemeElements />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{bondName}</h1>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full glass-effect hover:bg-white/30 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-effect rounded-xl p-6 flex flex-col items-center">
              <HeartAnimation size={120} className="mb-4" />
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Your Bond</h2>
                <p className="max-w-md mx-auto opacity-80 italic">"{bondReason}"</p>
              </div>
            </div>
            
            <StatusUpdate className="w-full" />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDisplay className="flex-1" />
              <BondCounter className="flex-1" />
            </div>
          </div>
          
          <div className={cn(
            "fixed top-0 right-0 h-full w-80 glass-effect p-6 z-50 transition-transform duration-300 ease-in-out transform shadow-xl",
            showSettings ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <PanelRight size={18} />
              </button>
            </div>
            
            <div className="space-y-6">
              <ThemeSelector />
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-medium mb-2">Bond Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="opacity-70">Name:</span> {bondName}
                  </div>
                  <div>
                    <span className="opacity-70">Reason:</span>
                    <p className="mt-1 italic">{bondReason}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to break this bond? This cannot be undone.")) {
                    localStorage.removeItem('heartBond');
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Break Bond
              </button>
            </div>
          </div>
          
          {showSettings && (
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowSettings(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bond;
