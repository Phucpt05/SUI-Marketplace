import { EnokiButton } from "../components/common/EnokiButton";
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function GgLogin() {
    const currentAccount = useCurrentAccount();
    const navigate = useNavigate();
    useEffect(() => {
        if (currentAccount) {
            navigate(`/profile/${currentAccount.address}`);
        }
    }, [currentAccount, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Sign in to Dolphinder
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Connect your Google account to access your developer profile
                    </p>
                </div>
                <div className="mt-8 bg-gray-900 py-8 px-6 shadow-lg rounded-lg">
                    <EnokiButton />
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-950 text-gray-400">New to Dolphinder?</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <a href="/" className="font-medium text-blue-400 hover:text-blue-300">
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}