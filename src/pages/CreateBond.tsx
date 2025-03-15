
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import HeartAnimation from '@/components/HeartAnimation';
import ThemeSelector from '@/components/ThemeSelector';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle } from 'lucide-react';

const CreateBond: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setBondName, 
    setBondReason, 
    setBondStartDate, 
    setHasBond,
    currentTheme,
    createBondWithSupabase,
    joinBond
  } = useBond();
  
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [bondCode, setBondCode] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCreateBond = async () => {
    setBondName(name);
    setBondReason(reason);
    setBondStartDate(new Date());
    
    const code = await createBondWithSupabase();
    if (code) {
      setBondCode(code);
      setShowShareDialog(true);
      setHasBond(true);
    } else {
      toast({
        title: "Error",
        description: "Could not create bond. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJoinBond = async () => {
    if (!joinCode.trim()) {
      setError('Please enter a bond code');
      return;
    }
    
    const success = await joinBond(joinCode.trim().toUpperCase());
    if (success) {
      navigate('/bond');
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(bondCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6",
      themeClasses[currentTheme]
    )}>
      <div className="animate-fade-in w-full max-w-md">
        <div className="text-center mb-8">
          <HeartAnimation size={80} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">HeartBond</h1>
          <p className="text-sm opacity-80">
            {isCreateMode ? "Create a new bond" : "Join an existing bond"}
          </p>
        </div>

        <Tabs value={isCreateMode ? "create" : "join"} onValueChange={(v) => setIsCreateMode(v === "create")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Create Bond</TabsTrigger>
            <TabsTrigger value="join">Join Bond</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="glass-effect rounded-xl p-6 backdrop-blur-md">
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
          </TabsContent>

          <TabsContent value="join" className="glass-effect rounded-xl p-6 backdrop-blur-md">
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
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-all",
                  buttonClasses[currentTheme]
                )}
              >
                Join Bond
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Bond Code</DialogTitle>
            <DialogDescription>
              Share this code with your partner so they can join your bond.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 bg-secondary/20 rounded-lg text-center mt-4">
            <h3 className="text-2xl font-bold tracking-widest">{bondCode}</h3>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button onClick={copyCodeToClipboard} className="flex items-center gap-2">
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
          
          <div className="text-center mt-6">
            <Button onClick={() => {
              setShowShareDialog(false);
              navigate('/bond');
            }}>
              Continue to Your Bond
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBond;
