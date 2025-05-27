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
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains';
import { Chains } from '../../types';

export function contractLink(contractAddress?: string | null, chainId?: number): string {
  return contractAddress ? `${chainRpc(chainId)}/address/${contractAddress}` : '';
}

export function transactionLink(transactionHash?: string | null, chainId?: number): string {
  if (!transactionHash) return '';
  return `${chainRpc(chainId)}tx/${transactionHash}`;
}
export function chainRpc(chainId?: number): string {
  switch (chainId) {
    // EVM Mainnet
    case Chains.ETHEREUM:
      return mainnet.blockExplorers.default.url;
    case Chains.MOONBEAM:
      return moonbeam.blockExplorers.default.url;
    case Chains.ASTAR:
      return astar.blockExplorers.default.url;
    case Chains.CELO:
      return celo.blockExplorers.default.url;
    case Chains.BASE:
      return base.blockExplorers.default.url;
    case Chains.ARBITRUM_ONE:
      return arbitrum.blockExplorers.default.url;
    case Chains.AVALANCHE:
      return avalanche.blockExplorers.default.url;
    case Chains.OPTIMISM:
      return optimism.blockExplorers.default.url;
    case Chains.POLYGON:
      return polygon.blockExplorers.default.url;

    // EVM Testnet
    case Chains.SEPOLIA:
      return sepolia.blockExplorers.default.url;
    case Chains.MOONBASE:
      return moonbaseAlpha.blockExplorers.default.url;
    case Chains.ALFAJORES:
      return celoAlfajores.blockExplorers.default.url;
    case Chains.BASE_SEPOLIA:
      return baseSepolia.blockExplorers.default.url;
    case Chains.ARBITRUM_ONE_SEPOLIA:
      return arbitrumSepolia.blockExplorers.default.url;
    case Chains.AVALANCHE_FUJI:
      return avalancheFuji.blockExplorers.default.url;
    case Chains.OPTIMISM_SEPOLIA:
      return optimismSepolia.blockExplorers.default.url;
    case Chains.POLYGON_AMOY:
      return polygonAmoy.blockExplorers.default.url;

    default:
      console.warn('Missing chainId');
      return '';
  }
}

export function chainCurrency(chainId?: number) {
  switch (chainId) {
    case Chains.ASTAR:
      return 'ASTR';
    case Chains.ARBITRUM_ONE:
    case Chains.ARBITRUM_ONE_SEPOLIA:
      return 'ARB';
    case Chains.MOONBEAM:
      return 'GLMR';
    case Chains.MOONBASE:
      return 'DEV';
    case Chains.OPTIMISM:
    case Chains.OPTIMISM_SEPOLIA:
      return 'OP';
    case Chains.POLYGON:
    case Chains.POLYGON_AMOY:
      return 'POL';
    default:
      return 'ETH';
  }
}
