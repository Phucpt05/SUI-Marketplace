import { useCurrentAccount } from '@mysten/dapp-kit';
import { KioskManager } from '../components/kiosk/KioskManager';
import ConnectBtn from '../components/common/ConnectBtn';
import Header from '../components/shared/Header';
import { Footer } from '../components/shared/Footer';

function HomePage() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Awesome NFT Marketplace
            </h1>
            <p className="text-gray-300 text-lg">
              Create, collect, and trade unique NFTs on Sui blockchain
            </p>
          </div>

          {!account ? (
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Awesome NFT</h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to start creating and managing your NFT collection
              </p>
              <div className="flex justify-center">
                <ConnectBtn />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Welcome back!</h2>
                <p className="text-gray-300">
                  Connected as: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </p>
              </div>
              
              <KioskManager />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;