import { KioskClient, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { KIOSK_PACKAGE_ID } from '../constant';

// Create a singleton KioskClient instance
let kioskClient: KioskClient | null = null;

export const getKioskClient = (suiClient: SuiClient, network: 'mainnet' | 'testnet' | 'devnet' | 'localnet' = 'testnet'): KioskClient => {
  if (kioskClient) {
    return kioskClient;
  }

  const networkConfig = network === 'mainnet' ? Network.MAINNET : Network.TESTNET;
  
  // For testnet and mainnet, we can use the predefined network
  if (network === 'mainnet' || network === 'testnet') {
    kioskClient = new KioskClient({
      client: suiClient,
      network: networkConfig,
    });
  } else {
    // For devnet or localnet, we need to provide custom package IDs
    kioskClient = new KioskClient({
      client: suiClient,
      network: Network.CUSTOM,
      packageIds: {
        kioskLockRulePackageId: KIOSK_PACKAGE_ID,
        royaltyRulePackageId: KIOSK_PACKAGE_ID,
        personalKioskRulePackageId: KIOSK_PACKAGE_ID,
        floorPriceRulePackageId: KIOSK_PACKAGE_ID,
      },
    });
  }

  return kioskClient;
};

// Helper function to create a new SuiClient
export const createSuiClient = (network: 'mainnet' | 'testnet' | 'devnet' | 'localnet' = 'testnet'): SuiClient => {
  return new SuiClient({ 
    url: getFullnodeUrl(network === 'localnet' ? 'testnet' : network) 
  });
};

// Export types for convenience
export type { KioskClient };