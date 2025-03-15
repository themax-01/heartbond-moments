
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ShareBondDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bondCode: string;
}

const ShareBondDialog: React.FC<ShareBondDialogProps> = ({ 
  open, 
  onOpenChange, 
  bondCode 
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyCodeToClipboard = () => {
    if (bondCode) {
      navigator.clipboard.writeText(bondCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Error",
        description: "No bond code available to copy",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onOpenChange(false);
            navigate('/bond');
          }}>
            Continue to Your Bond
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBondDialog;
