import { useCallback } from 'react';
import { useConnectorClient } from 'wagmi';
import { useAccount } from '@apillon/wallet-react';
import { createPublicClient, getContract, http, type Address } from 'viem';
import { useWeb3Context } from '../context/Web3Context';
import { useEmbeddedWallet } from './useEmbeddedWallet'; // custom hook
import { useWalletConnect } from './useWalletConnect'; // custom hook
import { CONTRACT_ADDRESS } from '../lib/config';
import nftAbi from '../lib/nftAbi';

let contract = null as any;

export function useContract() {
  const { collectionInfo, setCollectionInfo } = useWeb3Context();
  const { info } = useAccount();
  const { data: walletClient } = useConnectorClient();
  const { getContractBalance, mintEW } = useEmbeddedWallet();
  const { network, walletAddress, ensureCorrectNetwork } = useWalletConnect();

  const publicClient = createPublicClient({
    chain: network,
    transport: http(),
  });

  const initContract = async (write = false) => {
    if (contract && (!write || contract.write)) return;

    await ensureCorrectNetwork();

    contract = getContract({
      address: CONTRACT_ADDRESS,
      abi: nftAbi,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });
  };

  const readOnce = useCallback(
    async (field: keyof typeof collectionInfo, call: () => Promise<any>) => {
      if (!(field in collectionInfo) || collectionInfo[field]) return;

      await initContract();
      collectionInfo[field] = await call();
      setCollectionInfo(collectionInfo);
    },
    [collectionInfo, initContract]
  );

  const getBalance = async (force = false) => {
    if ((collectionInfo.balance === 0n || force) && walletAddress) {
      await initContract();
      const balance = info.activeWallet?.address
        ? await getContractBalance()
        : await contract.read.balanceOf([walletAddress]);
      setCollectionInfo({ ...collectionInfo, balance });
    }
    return Number(collectionInfo.balance);
  };

  const mintToken = async (price: bigint, amount = 1): Promise<Address | null> => {
    if(!walletAddress) return null;

    const value = price * BigInt(amount);
    const args = [walletAddress, amount];

    if (info.activeWallet?.address) {
      return await mintEW(args, value);
    }

    await initContract(true);
    const gasLimit = await calcGas(args, value);
    return await contract.write.mint(args, { value }, { gasLimit });
  };

  async function calcGas(args: Array<any>, value: bigint): Promise<bigint>{
    try {
      const gas = await publicClient.estimateContractGas({
      address: CONTRACT_ADDRESS,
      abi: nftAbi,
      functionName: 'mint',
      args,
      account: walletAddress as Address,
      value,
    });
      return (gas * 110n) / 100n;
    } catch (e: any) {
      console.error(e);
      return 250000n;
    }
  }

  const loadCollectionInfo = async () => {
    await initContract();
    await Promise.all([
      getBalance(),
      readOnce('drop', () => contract.read.isDrop([])),
      readOnce('dropStart', () => contract.read.dropStart([])),
      readOnce('autoIncrement', () => contract.read.isAutoIncrement([])),
      readOnce('maxSupply', () => contract.read.maxSupply([])),
      readOnce('name', () => contract.read.name([])),
      readOnce('price', () => contract.read.pricePerMint([])),
      readOnce('reserve', () => contract.read.reserve([])),
      readOnce('revokable', () => contract.read.isRevokable([])),
      readOnce('soulbound', () => contract.read.isSoulbound([])),
      readOnce('symbol', () => contract.read.symbol([])),
      readOnce('totalSupply', () => contract.read.totalSupply([])),
    ]);
    return collectionInfo;
  };

  const getTokenByIndex = async (index: number) => {
    await initContract();
    return await contract.read.tokenByIndex([index]);
  };

  const getTokenOfOwner = async (index: number) => {
    await initContract();
    return await contract.read.tokenOfOwnerByIndex([walletAddress, index]);
  };

  const getTokenUri = async (id: number) => {
    await initContract();
    return await contract.read.tokenURI([id]);
  };

  return {
    loadCollectionInfo,
    getBalance,
    getMaxSupply: async () => Number(await readOnce('maxSupply', () => contract.read.maxSupply([]))),
    getTokenByIndex,
    getTokenOfOwner,
    getTokenUri,
    getTotalSupply: async () => Number(await readOnce('totalSupply', () => contract.read.totalSupply([]))),
    mintToken,
  };
}
