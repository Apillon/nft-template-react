import { createContext, FC, ReactNode, useContext } from 'react';
import useWeb3Provider from '../hooks/useWeb3Provider';

export interface IWeb3Context {
  collectionInfo: CollectionInfo;
  filterByAddress: boolean;
  loadingNfts: boolean;
  myNftIDs: number[];
  nfts: Record<number, Nft>;
  setCollectionInfo: (s: CollectionInfo) => void;
  setFilterByAddress: (s: boolean) => void;
  setLoadingNfts: (s: boolean) => void;
  setMyNftIDs: (s: number[]) => void;
  setNfts: (s: Record<number, Nft>) => void;
}

const Web3Context = createContext<IWeb3Context | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const Web3ContextProvider: FC<Props> = ({ children }: Props) => {
  const {
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
  } = useWeb3Provider();

  return (
    <Web3Context.Provider
      value={{
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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);

  if (context === undefined) {
    throw new Error('useWeb3Context usage must be wrapped with GlobalContext provider.');
  }

  return context;
};

export default Web3ContextProvider;
