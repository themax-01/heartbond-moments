
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BondContextType, Theme } from './types';
import { generateUserId } from './utils';
import { 
  createBondWithSupabase,
  joinBondWithSupabase,
  loadBondDataFromSupabase,
  syncDataToSupabase,
  syncQuoteToSupabase,
  syncThemeToSupabase
} from './bondOperations';

export const BondContext = createContext<BondContextType | undefined>(undefined);

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

  // Wrapper for creating a bond
  const handleCreateBond = async () => {
    const code = await createBondWithSupabase(userId, bondName, bondReason, currentTheme, quote);
    if (code) {
      setBondCode(code);
      setBondStartDate(new Date());
      setHasBond(true);
    }
    return code;
  };

  // Wrapper for joining a bond
  const handleJoinBond = async (code: string) => {
    const { success, bondData } = await joinBondWithSupabase(code, userId);
    if (success && bondData) {
      setBondId(bondData.id);
      setBondName(bondData.name);
      setBondReason(bondData.reason || '');
      setBondStartDate(new Date(bondData.start_date));
      setCurrentTheme(bondData.theme as Theme);
      setBondCode(code);
      setHasBond(true);
      await loadBondData();
    }
    return success;
  };

  // Wrapper for loading bond data
  const loadBondData = async () => {
    if (!bondId) return;
    
    const data = await loadBondDataFromSupabase(bondId, userId);
    if (data) {
      setBondName(data.bondName);
      setBondReason(data.bondReason);
      setBondStartDate(data.bondStartDate);
      setCurrentTheme(data.currentTheme as Theme);
      setQuote(data.quote);
      setMyStatus(data.myStatus);
      setPartnerStatus(data.partnerStatus);
      setMyActivity(data.myActivity);
      setPartnerActivity(data.partnerActivity);
      setMyPlan(data.myPlan);
      setPartnerPlan(data.partnerPlan);
      setPartnerId(data.partnerId);
    }
  };

  // Wrapper for syncing status
  const syncStatus = async () => {
    if (bondId && myStatus) {
      await syncDataToSupabase('status', myStatus, bondId, userId);
    }
  };

  // Wrapper for syncing activity
  const syncActivity = async () => {
    if (bondId && myActivity) {
      await syncDataToSupabase('activity', myActivity, bondId, userId);
    }
  };

  // Wrapper for syncing plan
  const syncPlan = async () => {
    if (bondId && myPlan) {
      await syncDataToSupabase('plan', myPlan, bondId, userId);
    }
  };

  // Wrapper for syncing quote
  const syncQuote = async () => {
    if (bondId && quote) {
      await syncQuoteToSupabase(quote, bondId);
    }
  };

  // Wrapper for syncing theme
  const syncTheme = async () => {
    if (bondId && currentTheme) {
      await syncThemeToSupabase(currentTheme, bondId);
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
        joinBond: handleJoinBond,
        bondId,
        setBondId,
        userId,
        setUserId,
        partnerId,
        setPartnerId,
        createBondWithSupabase: handleCreateBond,
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
