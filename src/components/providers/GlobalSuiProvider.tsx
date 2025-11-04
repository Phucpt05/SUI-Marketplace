import {
  SuiClientProvider,
  useSuiClientContext,
  WalletProvider,
} from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import { networkConfig } from "../../config/networkConfig";
import { useEffect } from "react";

// Config options for the networks you want to connect to

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minutes
    },
  },
});

export function GlobalSuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
          <WalletProvider autoConnect>
            {children}
          </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

function RegisterEnokiWallets() {
	const { client, network } = useSuiClientContext();
	useEffect(() => {
		if (!isEnokiNetwork(network)) return;
		const { unregister } = registerEnokiWallets({
			apiKey: import.meta.env.VITE_PUBLIC_ENOKI_API_KEY,
			providers: {
				google: {
					clientId: import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID,
				},
			},
			client,
			network,
		});
		return unregister;
	}, [client, network]);
	return null;
}

