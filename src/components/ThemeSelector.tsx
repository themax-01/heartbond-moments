
import React from 'react';
import { useBond, Theme } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { 
  Flower, 
  Sun, 
  Leaf, 
  Snowflake, 
  Cherry,
  RotateCw
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ThemeSelectorProps {
  showAutoTransition?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ showAutoTransition = true }) => {
  const { currentTheme, setCurrentTheme } = useBond();
  const [autoTransition, setAutoTransition] = React.useState(() => {
    const saved = localStorage.getItem('autoThemeTransition');
    return saved !== null ? saved === 'true' : true;
  });

  const themes: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
    { 
      id: 'spring', 
      name: 'Spring', 
      icon: <Flower size={24} />, 
      color: 'bg-spring-primary text-spring-accent hover:bg-spring-secondary' 
    },
    { 
      id: 'summer', 
      name: 'Summer', 
      icon: <Sun size={24} />, 
      color: 'bg-summer-primary text-summer-accent hover:bg-summer-secondary' 
    },
    { 
      id: 'autumn', 
      name: 'Autumn', 
      icon: <Leaf size={24} />, 
      color: 'bg-autumn-primary text-autumn-accent hover:bg-autumn-secondary' 
    },
    { 
      id: 'winter', 
      name: 'Winter', 
      icon: <Snowflake size={24} />, 
      color: 'bg-winter-primary text-winter-accent hover:bg-winter-secondary' 
    },
    { 
      id: 'blossom', 
      name: 'Blossom', 
      icon: <Cherry size={24} />, 
      color: 'bg-blossom-primary text-blossom-accent hover:bg-blossom-secondary' 
    },
  ];

  const handleAutoTransitionChange = (checked: boolean) => {
    setAutoTransition(checked);
    localStorage.setItem('autoThemeTransition', checked.toString());
  };

  return (
    <div className="glass-effect p-4 rounded-xl w-full max-w-xs">
      <div className="text-center mb-3 font-medium">Theme Settings</div>
      
      {showAutoTransition && (
        <div className="flex items-center justify-between mb-4 p-2 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            <RotateCw size={16} />
            <span>Auto Transition</span>
          </div>
          <Switch 
            checked={autoTransition} 
            onCheckedChange={handleAutoTransitionChange}
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 justify-center">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm",
              theme.color,
              currentTheme === theme.id && "ring-2 ring-white ring-opacity-50 scale-105"
            )}
            aria-label={`Select ${theme.name} theme`}
          >
            {theme.icon}
            <span className="text-sm">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
