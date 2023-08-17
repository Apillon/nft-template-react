import React, { useMemo, useState } from 'react'
import Modal from 'react-modal'
import ScrollLock from '../utils/scroll-lock'
import styles from '../styles/NftCard.module.css'
import NftNestable from './NftNestable'

export default function NftCard ({ id, nft, isCollectionNestable, myNFTs }) {
  const [isModalOpen, setIsOpen] = useState(false)

  const isMyNFT = useMemo(() => {
    return myNFTs.includes(id)
  }, [myNFTs, id])

  function openModalNft () {
    ScrollLock.enable()
    setIsOpen(true)
  }
  function closeModalNft () {
    setIsOpen(false)
    ScrollLock.disable()
  }
  return (
    <div className={styles.nft} id={'nft_' + id}>
      <img src={nft.image} className={styles.nft_img} alt={nft.name} />
      <div className={styles.nft_content}>
        <h3>{nft.name || `#${id}`}</h3>
        <p>{nft.description}</p>
      {isCollectionNestable && isMyNFT && (
                <button onClick={() => openModalNft()}>
                  Open NFT
                </button>
      )}
      </div>
      <Modal
        className='modal'
        isOpen={isModalOpen}
        onRequestClose={closeModalNft}
        contentLabel="Example Modal"
      >
        <div className='modal-close'>
          <button className='btn-modal-exit' onClick={closeModalNft}></button>
        </div>
        <div className='modal-container'>
          <NftNestable nft={nft} />
        </div>
      </Modal>
    </div>
  )
}
