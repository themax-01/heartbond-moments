
import { useContext } from 'react';
import { BondContext } from './BondContextProvider';
import { BondContextType } from './types';

export const useBond = (): BondContextType => {
  const context = useContext(BondContext);
  if (context === undefined) {
    throw new Error('useBond must be used within a BondProvider');
  }
  return context;
};
