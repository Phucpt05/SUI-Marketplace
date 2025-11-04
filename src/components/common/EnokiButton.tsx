import { useConnectWallet, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet, EnokiWallet, AuthProvider } from '@mysten/enoki';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function EnokiButton() {
	const currentAccount = useCurrentAccount();
	const { mutate: connect, isPending } = useConnectWallet();
	const wallets = useWallets().filter(isEnokiWallet);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	
	const walletsByProvider = wallets.reduce(
		(map, wallet) => map.set(wallet.provider, wallet),
		new Map<AuthProvider, EnokiWallet>(),
	);
	const googleWallet = walletsByProvider.get('google');
	
	const handleConnect = () => {
		if (!googleWallet) {
			setError('Google wallet not available');
			return;
		}
		setError(null);
		connect(
			{ wallet: googleWallet },
			{
				onSuccess: () => {
					// Redirect to profile page after successful login
					navigate('/profile');
				},
				onError: (err) => {
					setError('Failed to connect with Google. Please try again.');
					console.error('Connection error:', err);
				}
			}
		);
	};
	
	if (currentAccount) {
		return (
			<div className="text-center">
				<div className="mb-4 text-green-400">Successfully connected!</div>
				<div className="text-sm text-gray-400">Address: {currentAccount.address}</div>
			</div>
		);
	}
	
	return (
		<div className="flex flex-col items-center space-y-4">
			{googleWallet ? (
				<button
					onClick={handleConnect}
					disabled={isPending}
					className="flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
				>
					{isPending ? (
						<>
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Connecting...
						</>
					) : (
						<>
							<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							Sign in with Google
						</>
					)}
				</button>
			) : (
				<div className="text-red-400">Google wallet not available. Please check your configuration.</div>
			)}
			{error && (
				<div className="text-red-400 text-sm">{error}</div>
			)}
		</div>
	);
}