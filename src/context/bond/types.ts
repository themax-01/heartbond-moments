
import { SupabaseClient } from '@supabase/supabase-js';

export type Theme = 'spring' | 'summer' | 'autumn' | 'winter' | 'blossom';

export interface BondContextType {
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
