'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { type ReactNode } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#10b981',
            logo: '/logo.png',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          loginMethods: ['wallet', 'email', 'sms'],
          supportedChains: [base],
        }}
      >
        <MiniKitProvider
          chain={base}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
        >
          {children}
        </MiniKitProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
