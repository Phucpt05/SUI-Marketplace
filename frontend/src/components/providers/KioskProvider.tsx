import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { KioskClient } from '@mysten/kiosk';
import { getKioskClient } from '../../lib/kioskClient';

interface KioskContextType {
  kioskClient: KioskClient;
}

const KioskContext = createContext<KioskContextType | null>(null);

export const useKioskClient = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKioskClient must be used within a KioskProvider');
  }
  return context.kioskClient;
};

interface KioskProviderProps {
  children: ReactNode;
}

export const KioskProvider = ({ children }: KioskProviderProps) => {
  const suiClient = useSuiClient();
  
  const kioskClient = useMemo(() => {
    return getKioskClient(suiClient);
  }, [suiClient]);

  return (
    <KioskContext.Provider value={{ kioskClient }}>
      {children}
    </KioskContext.Provider>
  );
};