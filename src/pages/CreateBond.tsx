
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBond } from '@/context/BondContext';
import HeartAnimation from '@/components/HeartAnimation';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateBondForm from '@/components/bond/CreateBondForm';
import JoinBondForm from '@/components/bond/JoinBondForm';
import ShareBondDialog from '@/components/bond/ShareBondDialog';

const CreateBond: React.FC = () => {
  const { code: joinCodeFromUrl } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { currentTheme, bondCode } = useBond();
  
  const [isCreateMode, setIsCreateMode] = useState(!joinCodeFromUrl);
  const [localBondCode, setLocalBondCode] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);

  const themeClasses = {
    spring: "bg-gradient-to-b from-spring-primary to-spring-secondary",
    summer: "bg-gradient-to-b from-summer-primary to-summer-secondary",
    autumn: "bg-gradient-to-b from-autumn-primary to-autumn-secondary",
    winter: "bg-gradient-to-b from-winter-primary to-winter-secondary",
    blossom: "bg-gradient-to-b from-blossom-primary to-blossom-secondary",
  };

  // Handle join code from URL parameter
  useEffect(() => {
    if (joinCodeFromUrl) {
      console.log("Join code detected in URL:", joinCodeFromUrl);
      setIsCreateMode(false);
    }
  }, [joinCodeFromUrl]);

  // Handle bond code from context
  useEffect(() => {
    if (bondCode && !localBondCode) {
      console.log("Setting local bond code from context:", bondCode);
      setLocalBondCode(bondCode);
    }
  }, [bondCode, localBondCode]);

  const handleBondCreated = (code: string) => {
    console.log("Bond created with code:", code);
    setLocalBondCode(code);
    setShowShareDialog(true);
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

        <Tabs 
          value={isCreateMode ? "create" : "join"} 
          onValueChange={(v) => setIsCreateMode(v === "create")} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Create Bond</TabsTrigger>
            <TabsTrigger value="join">Join Bond</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="glass-effect rounded-xl p-6 backdrop-blur-md">
            <CreateBondForm onBondCreated={handleBondCreated} />
          </TabsContent>

          <TabsContent value="join" className="glass-effect rounded-xl p-6 backdrop-blur-md">
            <JoinBondForm initialCode={joinCodeFromUrl} />
          </TabsContent>
        </Tabs>
      </div>

      <ShareBondDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog} 
        bondCode={localBondCode || bondCode}
      />
    </div>
  );
};

export default CreateBond;
