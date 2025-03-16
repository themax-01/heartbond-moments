
import React, { useState } from 'react';
import { useBond } from '@/context/BondContext';
import ThemeSelector from '@/components/ThemeSelector';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface CreateBondFormProps {
  onBondCreated: (code: string) => void;
}

const CreateBondForm: React.FC<CreateBondFormProps> = ({ onBondCreated }) => {
  const { 
    setBondName, 
    setBondReason, 
    setBondStartDate, 
    setHasBond,
    currentTheme,
    createBondWithSupabase,
  } = useBond();
  
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreateBond = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      setBondName(name);
      setBondReason(reason);
      setBondStartDate(new Date());
      
      const code = await createBondWithSupabase();
      if (code) {
        setHasBond(true);
        onBondCreated(code);
        toast({
          title: "Bond Created!",
          description: `Your bond code is: ${code}`,
        });
      } else {
        setError('Could not create bond. Please try again.');
      }
    } catch (err) {
      console.error('Create bond error:', err);
      setError('An error occurred while creating your bond.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
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
            disabled={isLoading}
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
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg transition-all",
              buttonClasses[currentTheme],
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? "Creating..." : "Create Bond"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateBondForm;
