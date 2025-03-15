
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type Theme = 'spring' | 'summer' | 'autumn' | 'winter' | 'blossom';

interface BondContextType {
  bondName: string;
  setBondName: (name: string) => void;
  bondReason: string;
  setBondReason: (reason: string) => void;
  bondStartDate: Date | null;
  setBondStartDate: (date: Date) => void;
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  quote: string;
  setQuote: (quote: string) => void;
  myStatus: string;
  setMyStatus: (status: string) => void;
  partnerStatus: string;
  setPartnerStatus: (status: string) => void;
  myActivity: string;
  setMyActivity: (activity: string) => void;
  partnerActivity: string;
  setPartnerActivity: (activity: string) => void;
  myPlan: string;
  setMyPlan: (plan: string) => void;
  partnerPlan: string;
  setPartnerPlan: (plan: string) => void;
  hasBond: boolean;
  setHasBond: (hasBond: boolean) => void;
  bondCode: string;
  setBondCode: (code: string) => void;
  joinBond: (code: string) => Promise<boolean>;
  bondId: string | null;
  setBondId: (id: string | null) => void;
  userId: string;
  setUserId: (id: string) => void;
  partnerId: string | null;
  setPartnerId: (id: string | null) => void;
  createBondWithSupabase: () => Promise<string | null>;
  loadBondData: () => Promise<void>;
  syncStatus: () => Promise<void>;
  syncActivity: () => Promise<void>;
  syncPlan: () => Promise<void>;
  syncQuote: () => Promise<void>;
  syncTheme: () => Promise<void>;
}

const BondContext = createContext<BondContextType | undefined>(undefined);

// Generate a random user ID since we're not implementing full auth
const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate a unique bond code
const generateBondCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const BondProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bondName, setBondName] = useState<string>('');
  const [bondReason, setBondReason] = useState<string>('');
  const [bondStartDate, setBondStartDate] = useState<Date | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>('spring');
  const [quote, setQuote] = useState<string>('Love is the bridge between two hearts');
  const [myStatus, setMyStatus] = useState<string>('');
  const [partnerStatus, setPartnerStatus] = useState<string>('');
  const [myActivity, setMyActivity] = useState<string>('');
  const [partnerActivity, setPartnerActivity] = useState<string>('');
  const [myPlan, setMyPlan] = useState<string>('');
  const [partnerPlan, setPartnerPlan] = useState<string>('');
  const [hasBond, setHasBond] = useState<boolean>(false);
  const [bondCode, setBondCode] = useState<string>('');
  const [bondId, setBondId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || generateUserId());
  const [partnerId, setPartnerId] = useState<string | null>(null);
  
  // Initialize user ID
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  // Set up real-time subscription to bond_data changes
  useEffect(() => {
    if (!bondId) return;

    const channel = supabase
      .channel('bond-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bond_data',
          filter: `bond_id=eq.${bondId}`
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData.user_id !== userId) {
            if (newData.status) setPartnerStatus(newData.status);
            if (newData.activity) setPartnerActivity(newData.activity);
            if (newData.plan) setPartnerPlan(newData.plan);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bond_data',
          filter: `bond_id=eq.${bondId}`
        },
        (payload) => {
          const updatedData = payload.new as any;
          if (updatedData.user_id !== userId) {
            if (updatedData.status) setPartnerStatus(updatedData.status);
            if (updatedData.activity) setPartnerActivity(updatedData.activity);
            if (updatedData.plan) setPartnerPlan(updatedData.plan);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bonds',
          filter: `id=eq.${bondId}`
        },
        (payload) => {
          const updatedData = payload.new as any;
          setCurrentTheme(updatedData.theme as Theme);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bond_settings',
          filter: `bond_id=eq.${bondId}`
        },
        (payload) => {
          const updatedData = payload.new as any;
          setQuote(updatedData.quote);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bondId, userId]);

  // Load saved bond from localStorage
  useEffect(() => {
    const loadLocalBond = async () => {
      const storedBond = localStorage.getItem('heartBond');
      if (storedBond) {
        const bondData = JSON.parse(storedBond);
        const bondId = localStorage.getItem('bondId');
        
        if (bondId) {
          setBondId(bondId);
          setHasBond(true);
          await loadBondData();
        } else {
          // Legacy data migration
          setBondName(bondData.bondName || '');
          setBondReason(bondData.bondReason || '');
          setBondStartDate(bondData.bondStartDate ? new Date(bondData.bondStartDate) : null);
          setCurrentTheme(bondData.currentTheme || 'spring');
          setQuote(bondData.quote || 'Love is the bridge between two hearts');
          setMyStatus(bondData.myStatus || '');
          setPartnerStatus(bondData.partnerStatus || '');
          setMyActivity(bondData.myActivity || '');
          setPartnerActivity(bondData.partnerActivity || '');
          setMyPlan(bondData.myPlan || '');
          setPartnerPlan(bondData.partnerPlan || '');
          setHasBond(true);
        }
      }
    };

    loadLocalBond();
  }, []);

  // Create a new bond in Supabase
  const createBondWithSupabase = async () => {
    try {
      const newBondCode = generateBondCode();
      
      // Create the bond
      const { data: bondData, error: bondError } = await supabase
        .from('bonds')
        .insert([
          { 
            name: bondName, 
            reason: bondReason, 
            start_date: new Date().toISOString(),
            theme: currentTheme,
            code: newBondCode
          }
        ])
        .select('id')
        .single();

      if (bondError) {
        toast({
          title: "Error creating bond",
          description: bondError.message,
          variant: "destructive"
        });
        return null;
      }

      const newBondId = bondData.id;
      setBondId(newBondId);
      setBondCode(newBondCode);

      // Add current user as a member
      const { error: memberError } = await supabase
        .from('bond_members')
        .insert([
          { bond_id: newBondId, user_id: userId }
        ]);

      if (memberError) {
        toast({
          title: "Error adding user to bond",
          description: memberError.message,
          variant: "destructive"
        });
        return null;
      }

      // Create initial bond settings
      const { error: settingsError } = await supabase
        .from('bond_settings')
        .insert([
          { bond_id: newBondId, quote: quote }
        ]);

      if (settingsError) {
        toast({
          title: "Error creating bond settings",
          description: settingsError.message,
          variant: "destructive"
        });
      }

      localStorage.setItem('bondId', newBondId);
      localStorage.setItem('bondCode', newBondCode);

      return newBondCode;
    } catch (error) {
      console.error("Error creating bond:", error);
      toast({
        title: "Error",
        description: "Failed to create bond. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Join an existing bond
  const joinBond = async (code: string) => {
    try {
      // Find the bond with the provided code
      const { data: bondData, error: bondError } = await supabase
        .from('bonds')
        .select('*')
        .eq('code', code)
        .single();

      if (bondError) {
        toast({
          title: "Error joining bond",
          description: "Bond code not found",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('bond_members')
        .select('*')
        .eq('bond_id', bondData.id)
        .eq('user_id', userId)
        .single();

      if (!existingMember && !memberCheckError) {
        // Add user as a bond member
        const { error: memberError } = await supabase
          .from('bond_members')
          .insert([
            { bond_id: bondData.id, user_id: userId }
          ]);

        if (memberError) {
          toast({
            title: "Error joining bond",
            description: memberError.message,
            variant: "destructive"
          });
          return false;
        }
      }

      // Update local state with bond data
      setBondId(bondData.id);
      setBondName(bondData.name);
      setBondReason(bondData.reason || '');
      setBondStartDate(new Date(bondData.start_date));
      setCurrentTheme(bondData.theme as Theme);
      setBondCode(code);
      setHasBond(true);

      // Save bond info to local storage
      localStorage.setItem('bondId', bondData.id);
      localStorage.setItem('bondCode', code);

      await loadBondData();

      toast({
        title: "Success!",
        description: `You've joined "${bondData.name}"!`,
      });

      return true;
    } catch (error) {
      console.error("Error joining bond:", error);
      toast({
        title: "Error",
        description: "Failed to join bond. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Load bond data from Supabase
  const loadBondData = async () => {
    if (!bondId) return;

    try {
      // Load bond details
      const { data: bondData, error: bondError } = await supabase
        .from('bonds')
        .select('*')
        .eq('id', bondId)
        .single();

      if (bondError) {
        console.error("Error loading bond data:", bondError);
        return;
      }

      setBondName(bondData.name);
      setBondReason(bondData.reason || '');
      setBondStartDate(new Date(bondData.start_date));
      setCurrentTheme(bondData.theme as Theme);

      // Load bond settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('bond_settings')
        .select('*')
        .eq('bond_id', bondId)
        .single();

      if (!settingsError && settingsData) {
        setQuote(settingsData.quote || 'Love is the bridge between two hearts');
      }

      // Load bond members
      const { data: membersData, error: membersError } = await supabase
        .from('bond_members')
        .select('user_id')
        .eq('bond_id', bondId);

      if (!membersError && membersData) {
        const partners = membersData.filter(member => member.user_id !== userId);
        if (partners.length > 0) {
          setPartnerId(partners[0].user_id);
        }
      }

      // Load my data
      const { data: myData, error: myDataError } = await supabase
        .from('bond_data')
        .select('*')
        .eq('bond_id', bondId)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!myDataError && myData) {
        if (myData.status) setMyStatus(myData.status);
        if (myData.activity) setMyActivity(myData.activity);
        if (myData.plan) setMyPlan(myData.plan);
      }

      // Load partner data if partnerId exists
      if (partnerId) {
        const { data: partnerData, error: partnerDataError } = await supabase
          .from('bond_data')
          .select('*')
          .eq('bond_id', bondId)
          .eq('user_id', partnerId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (!partnerDataError && partnerData) {
          if (partnerData.status) setPartnerStatus(partnerData.status);
          if (partnerData.activity) setPartnerActivity(partnerData.activity);
          if (partnerData.plan) setPartnerPlan(partnerData.plan);
        }
      }

    } catch (error) {
      console.error("Error loading bond data:", error);
    }
  };

  // Sync my status updates to Supabase
  const syncStatus = async () => {
    if (!bondId || !myStatus) return;

    try {
      // Check if existing record
      const { data: existingData, error: checkError } = await supabase
        .from('bond_data')
        .select('id')
        .eq('bond_id', bondId)
        .eq('user_id', userId)
        .is('status', 'not.null')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (checkError) {
        console.error("Error checking existing data:", checkError);
        return;
      }

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('bond_data')
          .update({ 
            status: myStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);

        if (updateError) {
          console.error("Error updating status:", updateError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('bond_data')
          .insert([{ 
            bond_id: bondId, 
            user_id: userId, 
            status: myStatus 
          }]);

        if (insertError) {
          console.error("Error inserting status:", insertError);
        }
      }
    } catch (error) {
      console.error("Error syncing status:", error);
    }
  };

  // Sync my activity updates to Supabase
  const syncActivity = async () => {
    if (!bondId || !myActivity) return;

    try {
      // Check if existing record
      const { data: existingData, error: checkError } = await supabase
        .from('bond_data')
        .select('id')
        .eq('bond_id', bondId)
        .eq('user_id', userId)
        .is('activity', 'not.null')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (checkError) {
        console.error("Error checking existing data:", checkError);
        return;
      }

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('bond_data')
          .update({ 
            activity: myActivity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);

        if (updateError) {
          console.error("Error updating activity:", updateError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('bond_data')
          .insert([{ 
            bond_id: bondId, 
            user_id: userId, 
            activity: myActivity 
          }]);

        if (insertError) {
          console.error("Error inserting activity:", insertError);
        }
      }
    } catch (error) {
      console.error("Error syncing activity:", error);
    }
  };

  // Sync my plan updates to Supabase
  const syncPlan = async () => {
    if (!bondId || !myPlan) return;

    try {
      // Check if existing record
      const { data: existingData, error: checkError } = await supabase
        .from('bond_data')
        .select('id')
        .eq('bond_id', bondId)
        .eq('user_id', userId)
        .is('plan', 'not.null')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (checkError) {
        console.error("Error checking existing data:", checkError);
        return;
      }

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('bond_data')
          .update({ 
            plan: myPlan,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);

        if (updateError) {
          console.error("Error updating plan:", updateError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('bond_data')
          .insert([{ 
            bond_id: bondId, 
            user_id: userId, 
            plan: myPlan 
          }]);

        if (insertError) {
          console.error("Error inserting plan:", insertError);
        }
      }
    } catch (error) {
      console.error("Error syncing plan:", error);
    }
  };

  // Sync quote updates to Supabase
  const syncQuote = async () => {
    if (!bondId) return;

    try {
      const { error: updateError } = await supabase
        .from('bond_settings')
        .update({ 
          quote: quote,
          updated_at: new Date().toISOString()
        })
        .eq('bond_id', bondId);

      if (updateError) {
        console.error("Error updating quote:", updateError);
      }
    } catch (error) {
      console.error("Error syncing quote:", error);
    }
  };

  // Sync theme updates to Supabase
  const syncTheme = async () => {
    if (!bondId) return;

    try {
      const { error: updateError } = await supabase
        .from('bonds')
        .update({ theme: currentTheme })
        .eq('id', bondId);

      if (updateError) {
        console.error("Error updating theme:", updateError);
      }
    } catch (error) {
      console.error("Error syncing theme:", error);
    }
  };

  // Sync status updates
  useEffect(() => {
    if (bondId && myStatus) {
      syncStatus();
    }
  }, [myStatus, bondId]);

  // Sync activity updates
  useEffect(() => {
    if (bondId && myActivity) {
      syncActivity();
    }
  }, [myActivity, bondId]);

  // Sync plan updates
  useEffect(() => {
    if (bondId && myPlan) {
      syncPlan();
    }
  }, [myPlan, bondId]);

  // Sync quote updates
  useEffect(() => {
    if (bondId && quote) {
      syncQuote();
    }
  }, [quote, bondId]);

  // Sync theme updates
  useEffect(() => {
    if (bondId && currentTheme) {
      syncTheme();
    }
  }, [currentTheme, bondId]);

  return (
    <BondContext.Provider
      value={{
        bondName,
        setBondName,
        bondReason,
        setBondReason,
        bondStartDate,
        setBondStartDate,
        currentTheme,
        setCurrentTheme,
        quote,
        setQuote,
        myStatus,
        setMyStatus,
        partnerStatus,
        setPartnerStatus,
        myActivity,
        setMyActivity,
        partnerActivity,
        setPartnerActivity,
        myPlan,
        setMyPlan,
        partnerPlan,
        setPartnerPlan,
        hasBond,
        setHasBond,
        bondCode,
        setBondCode,
        joinBond,
        bondId,
        setBondId,
        userId,
        setUserId,
        partnerId,
        setPartnerId,
        createBondWithSupabase,
        loadBondData,
        syncStatus,
        syncActivity,
        syncPlan,
        syncQuote,
        syncTheme
      }}
    >
      {children}
    </BondContext.Provider>
  );
};

export const useBond = (): BondContextType => {
  const context = useContext(BondContext);
  if (context === undefined) {
    throw new Error('useBond must be used within a BondProvider');
  }
  return context;
};
