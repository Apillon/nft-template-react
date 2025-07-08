import { useCallback } from 'react';
import { useAccount, useWallet } from '@apillon/wallet-react';
import { useConnectorClient } from 'wagmi';
import { useWeb3Context } from '../context/Web3Context';
import { useWalletConnect } from './useWalletConnect';
import { useContract } from './useContract';
import { toast } from 'react-toastify';
import { CONTRACT_ADDRESS } from '../lib/config';

export function useNft() {
  const { collectionInfo, myNftIDs, nfts, setFilterByAddress, setLoadingNfts, setMyNftIDs, setNfts } = useWeb3Context();
  const { wallet } = useWallet();
  const { info } = useAccount();
  const { data: walletClient, refetch } = useConnectorClient();
  const { ensureCorrectNetwork } = useWalletConnect();

  const { getBalance, getTokenOfOwner, getTokenByIndex, getTokenUri, getTotalSupply } = useContract();

  const getNfts = useCallback(async () => {
    setLoadingNfts(true);
    setFilterByAddress(false);
    await getTotalSupply();

    if (collectionInfo.totalSupply) {
      await fetchNFTs(collectionInfo.totalSupply);
    }

    setLoadingNfts(false);
  }, [getTotalSupply, collectionInfo.totalSupply]);

  const fetchNFTs = async (balance: bigint | null | undefined) => {
    const nftMap: Record<number, Nft> = {};

    if (Number(balance) === 0) return nftMap;

    try {
      const promises: Promise<void>[] = [];

      for (let i = 0; i < Number(balance); i++) {
        promises.push(
          getTokenByIndex(i).then(async (id) => {
            const nft = await fetchNft(Number(id));
            if (nft) {
              nftMap[Number(id)] = nft;
            }
          })
        );
      }

      await Promise.all(promises);
      setNfts(nftMap);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load one or more NFTs metadata. Please try again later.');
    }

    return nftMap;
  };

  const fetchNft = async (id: number): Promise<Nft | null> => {
    if (nfts[id]) return nfts[id];

    try {
      const url = await getTokenUri(id);
      const metadata = await fetch(url).then((res) => res.json());
      if (metadata?.name) {
        const nft: Nft = { id, ...metadata };
        setNfts({ ...nfts, [id]: nft });
        return nft;
      }
    } catch (e) {
      console.error(e);
      toast.error(`Failed to load metadata for NFT with ID ${id}. Please try again later.`);
    }

    return null;
  };

  function addtMyNftIDs(tokenId: string | number) {
    setMyNftIDs([...myNftIDs, Number(tokenId)]);
  }

  const fetchMyNftIDs = async (): Promise<number[]> => {
    const ids: number[] = [];

    try {
      const balance = await getBalance();

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await getTokenOfOwner(i);
        ids.push(Number(tokenId));
      }

      setMyNftIDs(ids);
    } catch (e) {
      console.error(e);
      toast.error('Token could not be minted! Wrong address or all tokens have already been minted.');
    }

    return ids;
  };

  const addNftId = async (nftId: string | number, metadata: Nft) => {
    await ensureCorrectNetwork();
    const image = metadata?.image || '';

    try {
      if (wallet?.events && info.activeWallet?.address) {
        wallet.events.emit('addTokenNft', {
          address: CONTRACT_ADDRESS,
          tokenId: Number(nftId),
        });
      } else {
        if (!walletClient) {
          await refetch();
        }

        // @ts-ignore
        await walletClient?.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721',
            options: {
              address: CONTRACT_ADDRESS,
              tokenId: nftId.toString(),
              image,
            },
          },
        } as any);
      }
    } catch (e) {
      console.error('Error importing NFT:', e);
      toast.info('If you want to import NFT to wallet, paste contract address and token ID into your wallet.');
    }
  };

  return {
    addNftId,
    addtMyNftIDs,
    getNfts,
    fetchNft,
    fetchMyNftIDs,
    showNfts: () => setFilterByAddress(false),
    showMyNfts: () => setFilterByAddress(true),
  };
}
