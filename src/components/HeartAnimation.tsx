
import React from 'react';
import { Heart } from 'lucide-react';
import { useBond } from '@/context/BondContext';
import { cn } from '@/lib/utils';

interface HeartAnimationProps {
  size?: number;
  className?: string;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ 
  size = 120, 
  className 
}) => {
  const { currentTheme } = useBond();
  
  const themeColors = {
    spring: 'text-spring-highlight',
    summer: 'text-summer-highlight',
    autumn: 'text-autumn-highlight',
    winter: 'text-winter-highlight',
    blossom: 'text-blossom-highlight',
  };
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      className
    )}>
      <div className="relative">
        <Heart 
          size={size} 
          className={cn(
            "animate-heartbeat transform-gpu", 
            themeColors[currentTheme],
            "fill-current"
          )} 
          strokeWidth={1.5} 
        />
        <div className="absolute inset-0 blur-sm opacity-50">
          <Heart 
            size={size} 
            className={cn(
              "animate-heartbeat transform-gpu", 
              themeColors[currentTheme],
              "fill-current"
            )} 
            strokeWidth={1.5} 
          />
        </div>
      </div>
    </div>
  );
};

export default HeartAnimation;
