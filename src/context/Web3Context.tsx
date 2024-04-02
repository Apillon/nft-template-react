import { createContext, FC, ReactNode, useContext } from 'react'
import useWeb3Provider, { IWeb3State } from '../hooks/useWeb3Provider'

export interface IWeb3Context {
  disconnect: () => void
  filterNfts: (filter: boolean) => void
  initContract: (contractAddress?: string, provider?: Provider) => Contract
  getChildren: (parentId: number, tokenAddress?: string) => void
  getCollectionInfo: (contract: Contract) => Promise<CollectionInfo>
  getContract: (address?: string) => Contract
  getMyNftIDs: (contractAddress?: string) => Promise<Array<number>>
  getNft: (nftId: number) => Nft | undefined
  getNfts: () => Promise<Nft[]>
  getPendingChildren: (parentId: number, tokenAddress?: string) => void
  getProvider: () => Provider
  getSigner: () => Promise<Signer>
  refreshNfts: (contract: Contract) => void
  resetNft: () => void
  setState: (s: IWeb3State) => void
  state: IWeb3State
}

const Web3Context = createContext<IWeb3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

const Web3ContextProvider: FC<Props> = ({ children }: { children: ReactNode }) => {
  const {
    disconnect,
    filterNfts,
    initContract,
    getChildren,
    getCollectionInfo,
    getContract,
    getMyNftIDs,
    getNft,
    getNfts,
    getPendingChildren,
    getProvider,
    getSigner,
    refreshNfts,
    resetNft,
    setState,
    state
  } = useWeb3Provider()

  return (
    <Web3Context.Provider
      value={{
        disconnect,
        filterNfts,
        initContract,
        getChildren,
        getCollectionInfo,
        getContract,
        getMyNftIDs,
        getNft,
        getNfts,
        getPendingChildren,
        getProvider,
        getSigner,
        refreshNfts,
        resetNft,
        setState,
        state
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3Context = () => {
  const context = useContext(Web3Context)

  if (context === undefined) {
    throw new Error('useWeb3Context usage must be wrapped with GlobalContext provider.')
  }

  return context
}

export default Web3ContextProvider
