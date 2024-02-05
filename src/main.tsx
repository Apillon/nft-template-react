import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import App from './App.tsx'
import { config } from './wagmi.ts'
import MainLayout from './layout/MainLayout';
import Web3ContextProvider from "./context/Web3Context";

import './styles/index.css'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextProvider>       
          <MainLayout>
            <App />
          </MainLayout>
        </Web3ContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
