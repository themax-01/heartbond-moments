
import React, { useState } from 'react';
import { useBond } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { HeartHandshake, Activity, Calendar } from 'lucide-react';

interface StatusUpdateProps {
  className?: string;
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({ className }) => {
  const { 
    myStatus, setMyStatus,
    myActivity, setMyActivity,
    myPlan, setMyPlan,
    partnerStatus, 
    partnerActivity, 
    partnerPlan,
    currentTheme 
  } = useBond();
  
  const [activeTab, setActiveTab] = useState<'status' | 'activity' | 'plan'>('status');

  const themeClasses = {
    spring: {
      bgPrimary: 'bg-spring-primary',
      bgSecondary: 'bg-spring-secondary',
      text: 'text-spring-accent',
      highlight: 'text-spring-highlight',
      button: 'bg-spring-highlight text-white hover:bg-spring-accent',
    },
    summer: {
      bgPrimary: 'bg-summer-primary',
      bgSecondary: 'bg-summer-secondary',
      text: 'text-summer-accent',
      highlight: 'text-summer-highlight',
      button: 'bg-summer-highlight text-white hover:bg-summer-accent',
    },
    autumn: {
      bgPrimary: 'bg-autumn-primary',
      bgSecondary: 'bg-autumn-secondary',
      text: 'text-autumn-accent',
      highlight: 'text-autumn-highlight',
      button: 'bg-autumn-highlight text-white hover:bg-autumn-accent',
    },
    winter: {
      bgPrimary: 'bg-winter-primary',
      bgSecondary: 'bg-winter-secondary',
      text: 'text-winter-accent',
      highlight: 'text-winter-highlight',
      button: 'bg-winter-highlight text-white hover:bg-winter-accent',
    },
    blossom: {
      bgPrimary: 'bg-blossom-primary',
      bgSecondary: 'bg-blossom-secondary',
      text: 'text-blossom-accent',
      highlight: 'text-blossom-highlight',
      button: 'bg-blossom-highlight text-white hover:bg-blossom-accent',
    },
  };

  const currentThemeClasses = themeClasses[currentTheme];

  // Handle input changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyStatus(e.target.value);
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyActivity(e.target.value);
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyPlan(e.target.value);
  };

  // Form submission is disabled - we update in real-time
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={cn("w-full max-w-md glass-effect rounded-xl p-5", className)}>
      <div className="flex justify-center mb-4 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
            activeTab === 'status' 
              ? currentThemeClasses.button
              : "bg-white/20 hover:bg-white/30"
          )}
        >
          <HeartHandshake size={16} />
          <span>Feeling</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
            activeTab === 'activity' 
              ? currentThemeClasses.button
              : "bg-white/20 hover:bg-white/30"
          )}
        >
          <Activity size={16} />
          <span>Doing</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
            activeTab === 'plan' 
              ? currentThemeClasses.button
              : "bg-white/20 hover:bg-white/30"
          )}
        >
          <Calendar size={16} />
          <span>Plans</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={cn(
          "bg-white/20 backdrop-blur-sm p-4 rounded-lg",
          "transition-all duration-300 ease-in-out"
        )}>
          <h3 className="font-medium mb-2 text-center">You</h3>
          <form onSubmit={handleSubmit}>
            {activeTab === 'status' && (
              <textarea
                placeholder="How are you feeling right now?"
                value={myStatus}
                onChange={handleStatusChange}
                className="w-full bg-transparent border border-white/30 rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            )}
            {activeTab === 'activity' && (
              <textarea
                placeholder="What are you doing right now?"
                value={myActivity}
                onChange={handleActivityChange}
                className="w-full bg-transparent border border-white/30 rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            )}
            {activeTab === 'plan' && (
              <textarea
                placeholder="What are your plans?"
                value={myPlan}
                onChange={handlePlanChange}
                className="w-full bg-transparent border border-white/30 rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            )}
          </form>
        </div>

        <div className={cn(
          "bg-white/20 backdrop-blur-sm p-4 rounded-lg",
          "transition-all duration-300 ease-in-out"
        )}>
          <h3 className="font-medium mb-2 text-center">Partner</h3>
          <div className="border border-white/30 rounded-lg p-2 min-h-[100px]">
            {activeTab === 'status' && (
              <p className="whitespace-pre-wrap">{partnerStatus || "Waiting for update..."}</p>
            )}
            {activeTab === 'activity' && (
              <p className="whitespace-pre-wrap">{partnerActivity || "Waiting for update..."}</p>
            )}
            {activeTab === 'plan' && (
              <p className="whitespace-pre-wrap">{partnerPlan || "Waiting for update..."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdate;
