import { useState } from 'react';

const useWeb3Provider = () => {
  const [nfts, setNfts] = useState<Record<number, Nft>>({});
  const [myNftIDs, setMyNftIDs] = useState<number[]>([]);
  const [filterByAddress, setFilterByAddress] = useState(false);
  const [loadingNfts, setLoadingNfts] = useState(false);

  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
    balance: 0n,
    drop: null,
    dropStart: 0,
    autoIncrement: null,
    maxSupply: 0n,
    name: '',
    price: 0n,
    reserve: 0n,
    revokable: null,
    soulbound: null,
    symbol: '',
    totalSupply: 0n,
  });

  return {
    collectionInfo,
    filterByAddress,
    loadingNfts,
    myNftIDs,
    nfts,
    setCollectionInfo,
    setFilterByAddress,
    setLoadingNfts,
    setMyNftIDs,
    setNfts,
  };
};

export default useWeb3Provider;
