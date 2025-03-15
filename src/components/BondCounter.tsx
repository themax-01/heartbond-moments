
import React, { useEffect, useState } from 'react';
import { useBond } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

interface BondCounterProps {
  className?: string;
}

const BondCounter: React.FC<BondCounterProps> = ({ className }) => {
  const { bondStartDate, currentTheme } = useBond();
  const [duration, setDuration] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!bondStartDate) return;

    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - bondStartDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDuration({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [bondStartDate]);

  const themeClasses = {
    spring: "bg-spring-primary/70 text-spring-accent",
    summer: "bg-summer-primary/70 text-summer-accent",
    autumn: "bg-autumn-primary/70 text-autumn-accent",
    winter: "bg-winter-primary/70 text-winter-accent",
    blossom: "bg-blossom-primary/70 text-blossom-accent",
  };

  if (!bondStartDate) return null;

  return (
    <div className={cn(
      "glass-effect rounded-xl p-4 text-center transition-all duration-300",
      themeClasses[currentTheme],
      className
    )}>
      <div className="flex items-center justify-center mb-2">
        <Timer size={16} className="mr-2" />
        <h3 className="font-medium">Bond Duration</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div className="text-2xl font-semibold">{duration.days}</div>
          <div className="text-xs opacity-80">days</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div className="text-2xl font-semibold">{duration.hours}</div>
          <div className="text-xs opacity-80">hours</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div className="text-2xl font-semibold">{duration.minutes}</div>
          <div className="text-xs opacity-80">min</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div className="text-2xl font-semibold">{duration.seconds}</div>
          <div className="text-xs opacity-80">sec</div>
        </div>
      </div>
    </div>
  );
};

export default BondCounter;
