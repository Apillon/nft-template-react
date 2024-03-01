import { createContext, FC, ReactNode, useContext } from 'react'
import useWeb3Provider, { IWeb3State } from '../hooks/useWeb3Provider'

export interface IWeb3Context {
  disconnect: () => void
  filterNfts: (filter: boolean) => void
  initContract: (contractAddress?: string, provider?: Provider) => Contract
  getCollectionInfo: (contract: Contract) => Promise<CollectionInfo>
  getContract: (address: string) => Contract
  getMyNftIDs: (contractAddress?: string) => Promise<Array<number>>
  getNft: (nftId: number) => Nft | undefined
  getNfts: () => Promise<Nft[]>
  getProvider: () => Provider
  getSigner: () => Promise<Signer>
  resetNft: () => void
  setState: (s: IWeb3State) => void
  state: IWeb3State
}

const Web3Context = createContext<IWeb3Context | null>(null)

type Props = {
  children: ReactNode
}

const Web3ContextProvider: FC<Props> = ({ children }) => {
  const {
    disconnect,
    filterNfts,
    initContract,
    getCollectionInfo,
    getContract,
    getMyNftIDs,
    getNft,
    getNfts,
    getProvider,
    getSigner,
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
        getCollectionInfo,
        getContract,
        getMyNftIDs,
        getNft,
        getNfts,
        getProvider,
        getSigner,
        resetNft,
        setState,
        state
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider

export const useWeb3Context = () => useContext(Web3Context)
