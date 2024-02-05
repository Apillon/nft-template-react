import { BigNumber, ethers } from 'ethers';

/** NFT Chains */
export enum Chains {
  MOONBEAM = '0x504',
  MOONBASE = '0x507',
  ASTAR = '0x250',
}
declare global {
  /**
   * Window
   */
  interface Window {
    ethereum: any;
  }
  interface NftResponse {
    name: string;
    description: string;
    image: string;
  }
  interface Nft {
    id: number;
    key: number;
    name: string;
    description: string;
    image: string;
  }
  interface CollectionInfo {
    address: String;
    drop: Boolean;
    dropStart: BigNumber;
    maxSupply: BigNumber;
    name: String;
    price: BigNumber;
    reserve: BigNumber;
    revokable: Boolean;
    royaltiesFees: BigNumber;
    royaltiesAddress: String;
    soulbound: Boolean;
    symbol: String;
    totalSupply: BigNumber;
  }
  interface Child {
    contractAddress: string;
    tokenId: BigNumber;
  }

  /** State */
  type Provider = ethers.providers.Web3Provider;
  type Signer = ethers.providers.JsonRpcSigner;
  type Contract = ethers.Contract;
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
