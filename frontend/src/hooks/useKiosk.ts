import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useKioskClient } from '../components/providers/KioskProvider';
import { PERSONAL_KIOSK_CAP_TYPE } from '../constant';
import { useState, useEffect } from 'react';

export interface KioskInfo {
  kioskId: string;
  kioskCapId: string;
}

export const useKiosk = () => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const kioskClient = useKioskClient();
  const [kioskInfo, setKioskInfo] = useState<KioskInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserKiosk = async () => {
    if (!account?.address) {
      setKioskInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all PersonalKioskCap objects owned by the user
      const kioskCaps = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: PERSONAL_KIOSK_CAP_TYPE,
        },
        options: {
          showContent: true,
        },
      });

      if (kioskCaps.data.length === 0) {
        setKioskInfo(null);
        return;
      }

      // Get the first PersonalKioskCap
      const kioskCap = kioskCaps.data[0];
      
      if (!kioskCap.data?.content) {
        setError('Invalid kiosk cap structure');
        return;
      }
      
      // Type assertion to extract kiosk ID
      const content = kioskCap.data.content as unknown;
      if (typeof content !== 'object' || content === null) {
        setError('Invalid kiosk cap content');
        return;
      }
      
      const contentObj = content as { fields?: { cap?: { fields?: { kiosk_id?: string } } } };
      const kioskId = contentObj.fields?.cap?.fields?.kiosk_id;
      
      if (!kioskId) {
        setError('Could not extract kiosk ID');
        return;
      }
      
      setKioskInfo({
        kioskId,
        kioskCapId: kioskCap.data?.objectId || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kiosk');
      console.error('Error fetching kiosk:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserKiosk();
  }, [account?.address]);

  const refetch = () => {
    fetchUserKiosk();
  };

  const getKiosk = async () => {
    if (!kioskInfo?.kioskId) return null;
    try {
      return await kioskClient.getKiosk({ id: kioskInfo.kioskId });
    } catch (err) {
      console.error('Error getting kiosk details:', err);
      return null;
    }
  };

  return {
    kioskInfo,
    loading,
    error,
    refetch,
    getKiosk,
    hasKiosk: !!kioskInfo,
  };
};