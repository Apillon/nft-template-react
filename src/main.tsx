import { Buffer } from 'buffer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Web3ContextProvider from './context/Web3Context.tsx';
import { config } from './lib/wagmiConfig';

import App from './App.tsx';
import MainLayout from './layout/MainLayout';

import './index.css';
import 'react-tooltip/dist/react-tooltip.css';

globalThis.Buffer = Buffer;
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextProvider>
          <MainLayout>
            <App />
          </MainLayout>
        </Web3ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
