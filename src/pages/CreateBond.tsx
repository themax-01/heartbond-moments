
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import HeartAnimation from '@/components/HeartAnimation';
import ThemeSelector from '@/components/ThemeSelector';
import { cn } from '@/lib/utils';

const CreateBond: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setBondName, 
    setBondReason, 
    setBondStartDate, 
    setHasBond,
    currentTheme 
  } = useBond();
  
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

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

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('Please enter a name for your bond');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!reason.trim()) {
        setError('Please share why you are creating this bond');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleCreateBond = () => {
    setBondName(name);
    setBondReason(reason);
    setBondStartDate(new Date());
    setHasBond(true);
    navigate('/bond');
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6",
      themeClasses[currentTheme]
    )}>
      <div className="animate-fade-in w-full max-w-md">
        <div className="text-center mb-8">
          <HeartAnimation size={80} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Create Your Bond</h1>
          <p className="text-sm opacity-80">
            {step === 1 && "Let's start by naming your special connection"}
            {step === 2 && "Share why you're creating this bond"}
            {step === 3 && "Choose a theme for your bond"}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 backdrop-blur-md">
          {step === 1 && (
            <div className="animate-fade-in">
              <label className="block mb-2 font-medium">Name Your Bond</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Our Special Connection"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all mb-4"
              />
              <p className="text-sm opacity-70 mb-4">
                This name will be displayed throughout your bond experience.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <label className="block mb-2 font-medium">Why are you creating this bond?</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Share the reason for this special connection..."
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all mb-4 min-h-[120px]"
              />
              <p className="text-sm opacity-70 mb-4">
                This will be saved and can be viewed throughout your journey together.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="mb-6 w-full">
                <ThemeSelector />
              </div>
              <p className="text-sm opacity-70 mb-6 text-center">
                You can always change the theme later.
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-500 bg-red-500/10 p-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all",
                  buttonClasses[currentTheme]
                )}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateBond}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all",
                  buttonClasses[currentTheme]
                )}
              >
                Create Bond
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBond;
