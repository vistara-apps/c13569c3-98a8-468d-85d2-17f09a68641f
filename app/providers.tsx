'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { base } from 'viem/chains';
import { http } from 'viem';
import { createConfig } from 'wagmi';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { type ReactNode } from 'react';

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
      },
    },
  }));

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['wallet', 'farcaster'],
        appearance: {
          theme: 'light',
          accentColor: '#10B981',
          logo: '/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        farcaster: {
          enabled: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <MiniKitProvider
            chain={base}
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
          >
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </MiniKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
