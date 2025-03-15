
import React from 'react';
import { useBond, Theme } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { 
  Flower, 
  Sun, 
  Leaf, 
  Snowflake, 
  Cherry 
} from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setCurrentTheme } = useBond();

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

  return (
    <div className="glass-effect p-4 rounded-xl w-full max-w-xs">
      <div className="text-center mb-3 font-medium">Choose Theme</div>
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
