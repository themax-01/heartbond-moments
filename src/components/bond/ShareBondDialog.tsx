
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, Share2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

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
  const [shareUrl, setShareUrl] = useState('');
  
  // Generate shareable URL when bond code changes
  useEffect(() => {
    if (bondCode) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/join/${bondCode}`);
    }
  }, [bondCode]);
  
  // Ensure we have a bond code to display
  useEffect(() => {
    if (open && !bondCode) {
      console.error('No bond code provided to ShareBondDialog');
      toast({
        title: "Error",
        description: "No bond code available",
        variant: "destructive"
      });
    } else if (open && bondCode) {
      console.log("ShareBondDialog opened with code:", bondCode);
    }
  }, [open, bondCode]);

  const copyCodeToClipboard = () => {
    if (bondCode) {
      navigator.clipboard.writeText(bondCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Bond code copied to clipboard"
      });
    } else {
      toast({
        title: "Error",
        description: "No bond code available to copy",
        variant: "destructive"
      });
    }
  };

  const copyLinkToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard"
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: 'Join my HeartBond',
          text: 'Join our connection in HeartBond with this link:',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        copyLinkToClipboard();
      }
    } else {
      copyLinkToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Bond Code</DialogTitle>
          <DialogDescription>
            Share this code with your partner so they can join your bond.
          </DialogDescription>
        </DialogHeader>
        
        {bondCode ? (
          <>
            <div className="p-6 bg-secondary/20 rounded-lg text-center mt-4">
              <h3 className="text-2xl font-bold tracking-widest">{bondCode}</h3>
            </div>
            
            <div className="flex justify-center mt-4 gap-2">
              <Button onClick={copyCodeToClipboard} className="flex items-center gap-2">
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-sm text-center">Or share this link with your partner:</p>
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={shareLink} size="icon">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button onClick={() => {
                onOpenChange(false);
                navigate('/bond');
              }}>
                Continue to Your Bond
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-red-500">No bond code available</p>
            <Button 
              onClick={() => onOpenChange(false)} 
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareBondDialog;
