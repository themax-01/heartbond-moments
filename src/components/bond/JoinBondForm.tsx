
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const JoinBondForm: React.FC = () => {
  const navigate = useNavigate();
  const { joinBond, currentTheme } = useBond();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const buttonClasses = {
    spring: "bg-spring-highlight hover:bg-spring-accent text-white",
    summer: "bg-summer-highlight hover:bg-summer-accent text-white",
    autumn: "bg-autumn-highlight hover:bg-autumn-accent text-white",
    winter: "bg-winter-highlight hover:bg-winter-accent text-winter-primary",
    blossom: "bg-blossom-highlight hover:bg-blossom-accent text-white",
  };

  const handleJoinBond = async () => {
    if (!joinCode.trim()) {
      setError('Please enter a bond code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await joinBond(joinCode.trim().toUpperCase());
      if (success) {
        toast({
          title: "Success!",
          description: "You've joined the bond successfully!",
        });
        navigate('/bond');
      } else {
        setError('Failed to join bond. Please check the code and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Join bond error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <label className="block mb-2 font-medium">Enter Bond Code</label>
      <input
        type="text"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        placeholder="e.g., ABC123"
        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all mb-4"
        maxLength={6}
      />
      <p className="text-sm opacity-70 mb-6">
        Enter the 6-character code you received from your partner to join their bond.
      </p>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleJoinBond}
        disabled={isLoading}
        className={cn(
          "w-full px-4 py-2 rounded-lg transition-all",
          buttonClasses[currentTheme],
          isLoading && "opacity-70 cursor-not-allowed"
        )}
      >
        {isLoading ? "Joining..." : "Join Bond"}
      </button>
    </div>
  );
};

export default JoinBondForm;
