import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { KIOSK_PACKAGE_ID } from '../../constant';
import { useKiosk } from '../../hooks/useKiosk';
import { Button } from '../shared/Button';
import { useToast } from '../providers/ToastProvider';

export const KioskManager = () => {
  const account = useCurrentAccount();
  const { hasKiosk, loading, refetch } = useKiosk();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const { success, error } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createKiosk = async () => {
    if (!account?.address) {
      error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    
    try {
      const tx = new Transaction();
      
      // Create a new kiosk and kiosk owner cap
      const [kiosk, kioskCap] = tx.moveCall({
        target: '0x2::kiosk::new',
        arguments: []
      });

      // Convert to personal kiosk
      tx.moveCall({
        target: `${KIOSK_PACKAGE_ID}::personal_kiosk::default`,
        arguments: [kiosk, kioskCap]
      });

      tx.setSender(account.address);

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            success('Kiosk created successfully!');
            refetch();
            console.log('Transaction result:', result);
          },
          onError: (err) => {
            error(`Failed to create kiosk: ${err.message}`);
            console.error('Transaction error:', err);
          },
        }
      );
    } catch (err) {
      error(`Error creating kiosk: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading kiosk information...</div>
      </div>
    );
  }

  if (!hasKiosk) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Create Your Personal Kiosk</h2>
        <p className="text-gray-300 mb-6">
          You need a personal kiosk to manage your NFTs. A personal kiosk is a secure space where you can store, display, and trade your NFTs.
        </p>
        <Button
          onClick={createKiosk}
          disabled={isCreating || isPending}
          className="w-full"
        >
          {isCreating || isPending ? 'Creating...' : 'Create Personal Kiosk'}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Your Personal Kiosk</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          <span className="text-green-400 font-semibold">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Owner:</span>
          <span className="text-white text-sm">
            {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
          </span>
        </div>
        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm mb-4">
            Your personal kiosk is ready! You can now mint NFTs and manage your collection.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
              View Collection
            </Button>
            <Button className="flex-1">
              Mint NFT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};