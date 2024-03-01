import { useMemo, useState } from 'react'
import Modal from 'react-modal'

import useWeb3Provider from '../../hooks/useWeb3Provider'
import ScrollLock from '../../lib/utils/scroll-lock'
import Header from '../Header'
import NftNestable from './NftNestable'
import CollectionInfo from '../CollectionInfo'
import NftNesting from './NftNesting'

interface NftProps {
  nft: Nft
  open?: Boolean
}

export default function NftCard({ nft, open }: NftProps) {
  const { state } = useWeb3Provider()
  const [isModalOpen, setIsOpen] = useState(false)

  const isMyNFT = useMemo(() => {
    return state.myNftIDs.includes(nft.id)
  }, [nft])

  function openModalNft() {
    ScrollLock.enable()
    setIsOpen(true)
  }
  function closeModalNft() {
    setIsOpen(false)
    ScrollLock.disable()
  }
  return (
    <>
      <div className="nft">
        {isMyNFT}
        <img src={nft.image} className="object-contain" alt={nft.name} />
        <div className="pt-4 px-6 pb-6">
          <h3>
            #{nft.id} {nft.name}
          </h3>
          <p>{nft.description}</p>
          {state.isNestable && open && isMyNFT && <button onClick={() => openModalNft()}>Open NFT</button>}
        </div>
      </div>
      {open && isModalOpen && (
        <Modal className="modal bg-bg" ariaHideApp={false} isOpen={isModalOpen} onRequestClose={() => closeModalNft()}>
          <div className="container modal-container relative">
            <Header />
            <div className="absolute">
              <button onClick={() => closeModalNft()}>&#8656; Go back</button>
            </div>
            <NftNestable nft={nft} key={nft.id} />
          </div>
        </Modal>
      )}
    </>
  )
}
