import { useEffect, useMemo } from 'react'
import { useWeb3Context } from '../../context/Web3Context'
import NftCard from './NftCard'
import Spinner from '../Spinner'

export default function NftGallery() {
  const { state, setState } = useWeb3Context()

  const nfts = useMemo(() => {
    return state.filterByWallet ? state.nfts.filter((item) => state.myNftIDs.includes(item.id)) : state.nfts
  }, [state.nfts, state.filterByWallet, state.collectionInfo?.totalSupply])

  useEffect(() => {
    setState(state)
  }, [state.collectionInfo?.totalSupply])
  useEffect(() => {
    setState(state)
  }, [state.nfts])
  useEffect(() => {
    setState(state)
  }, [state])

  return (
    <div className="relative">
      {' '}
      {(() => {
        if (state.loadingNfts) {
          return <Spinner />
        } else if (nfts?.length) {
          return (
            <div className="grid grid-cols-nft gap-8">
              {nfts.map((nft) => {
                return <NftCard key={nft.id} nft={nft} open={true} />
              })}
            </div>
          )
        } else if (state.walletAddress) {
          return (
            <div className="text-center">
              <p>You don`t have any NFTs</p>
            </div>
          )
        } else {
          return (
            <div className="text-center">
              <p>No NFTs, they must be minted first.</p>
            </div>
          )
        }
      })()}
    </div>
  )
}
