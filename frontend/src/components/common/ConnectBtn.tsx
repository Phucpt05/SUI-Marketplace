import {
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { useModalStore } from "../../store/useModalStore";
import { Button } from "../shared/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../providers/ToastProvider";
import { isEnokiWallet } from "@mysten/enoki";
import { useNavigate } from "react-router-dom";

const ConnectBtn = () => {
  const { open } = useModalStore();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const account = useCurrentAccount();
  const { success } = useToast();

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border border-white/20">
          <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer">
            <a href={`/profile/${account.address}`} className="flex items-center gap-2 w-full">
              <span className="text-blue-400">👤</span> Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer">
            <p className="flex items-center gap-2 w-full" onClick={() => {
              disconnectWallet(undefined, {
                onSuccess: () => {
                  success('Wallet disconnected successfully!');
                }
              });
            }}>
              <span className="text-red-400">🔌</span> Disconnect
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => open({ content: <ConnectModal /> })}>Connect</Button>
  );
};

const ConnectModal = () => {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { close } = useModalStore();
  const { success, error } = useToast();
  const navigate = useNavigate();

  
  if (currentAccount) {
		return <div>Current address: {currentAccount.address}</div>;
	}
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Connect your wallet</h1>

      <div className="mt-4 flex flex-col gap-2">
        {wallets.filter(wallet => {
          // Include all non-Enoki wallets (including Suiet)
          if (!isEnokiWallet(wallet)) return true;
          // Only include Enoki wallets that are not from Google
          return isEnokiWallet(wallet) && wallet.provider !== 'google';
        }).map(wallet => (
          <Button
            onClick={() => {
              connect(
                { wallet },
                {
                  onSuccess: () => {
                    success(`Connected to ${wallet.name} successfully!`);
                    close();
                  },
                  onError: (connectError: Error) => {
                    error(`Failed to connect to ${wallet.name}: ${connectError.message}`);
                  },
                }
              );
            }}
            key={wallet.name}
            className="flex items-center gap-2 px-2"
          >
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="size-12 rounded-full"
            />
            {wallet.name}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          onClick={() => {
            navigate('/gg-login');
            close();
          }}
          className="flex items-center justify-center gap-2 px-2 bg-white text-gray-800 hover:bg-gray-100"
        >
          <p className="text-gray-400">--or</p>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default ConnectBtn;
