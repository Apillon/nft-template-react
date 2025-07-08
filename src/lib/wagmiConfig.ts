import { createConfig, http, createStorage } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  astar,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  celo,
  celoAlfajores,
  Chain,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'wagmi/chains';
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const chains: readonly [Chain, ...Chain[]] = [
  arbitrum,
  arbitrumSepolia,
  astar,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  celo,
  celoAlfajores,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
];

const transports = chains.reduce(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {} as Record<number, ReturnType<typeof http>>
);
const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT;

const connectors = WALLET_CONNECT_PROJECT_ID ? [
  metaMask({ dappMetadata: { name: 'Apillon NFT Template' } }),
  coinbaseWallet({ appName: 'Apillon NFT Template' }),
  walletConnect({projectId:WALLET_CONNECT_PROJECT_ID})
]: [
  metaMask({ dappMetadata: { name: 'Apillon NFT Template' } }),
  coinbaseWallet({ appName: 'Apillon NFT Template' })
];

export const config = createConfig({
  chains,
  connectors,
  transports,
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: window.sessionStorage }),
});
