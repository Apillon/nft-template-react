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

/** NFT Chains */
export enum Chains {
  ETHEREUM = mainnet.id,
  SEPOLIA = sepolia.id,
  ARBITRUM_ONE = arbitrum.id,
  ARBITRUM_ONE_SEPOLIA = arbitrumSepolia.id,
  ASTAR = astar.id,
  AVALANCHE = avalanche.id,
  AVALANCHE_FUJI = avalancheFuji.id,
  BASE = base.id,
  BASE_SEPOLIA = baseSepolia.id,
  CELO = celo.id,
  ALFAJORES = celoAlfajores.id,
  MOONBEAM = moonbeam.id,
  MOONBASE = moonbaseAlpha.id,
  POLYGON = polygon.id,
  POLYGON_AMOY = polygonAmoy.id,
  OPTIMISM = optimism.id,
  OPTIMISM_SEPOLIA = optimismSepolia.id,
}
declare global {
  interface Window {
    ethereum?: any;
  }

  interface NftResponse {
    name: string;
    description: string;
    image: string;
  }
  interface Nft {
    id: number;
    name: string;
    description: string;
    image: string;
  }
  interface CollectionInfo {
    balance: bigint;
    drop: boolean | null;
    dropStart: number;
    autoIncrement: boolean | null;
    maxSupply: bigint;
    name: string;
    price: bigint;
    reserve: bigint;
    revokable: boolean | null;
    soulbound: boolean | null;
    symbol: string;
    totalSupply: bigint;
  }

  /** State */
  interface StateInterface {
    chainId: string;
    nftAddress: string;
    currentChain: string;
    collectionInfo: CollectionInfo | null;
    myNftIDs: Array<number>;
    nft: Nft | undefined;
    nfts: Nft[];
    filterByAddress: boolean;
    isCollectionNestable: boolean;
    loading: boolean;
    loadingNft: boolean;
    loadingNfts: boolean;
    loadingMyNfts: boolean;
    walletAddress: string;
  }
}
