
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const BondContext = createContext<BondContextType | undefined>(undefined);

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

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBond = localStorage.getItem('heartBond');
    if (storedBond) {
      const bondData = JSON.parse(storedBond);
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
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (hasBond) {
      const bondData = {
        bondName,
        bondReason,
        bondStartDate,
        currentTheme,
        quote,
        myStatus,
        partnerStatus,
        myActivity,
        partnerActivity,
        myPlan,
        partnerPlan,
      };
      localStorage.setItem('heartBond', JSON.stringify(bondData));
    }
  }, [
    bondName,
    bondReason,
    bondStartDate,
    currentTheme,
    quote,
    myStatus,
    partnerStatus,
    myActivity,
    partnerActivity,
    myPlan,
    partnerPlan,
    hasBond,
  ]);

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
