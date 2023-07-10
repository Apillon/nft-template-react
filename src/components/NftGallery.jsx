import styles from '../styles/NftGallery.module.css'
import NftCard from './NftCard'
import React from 'react'

export default function NftGallery ({ nfts, address }) {
  return (
    <div className={styles.nft_grid}>
      {nfts?.length
        ? (
            nfts.map((nft) => {
              return <NftCard key={nft.id} id={nft.id} nft={nft} />
            })
          )
        : address
          ? (
        <div className={styles.loading_box}>
          <p>You don`t have any NFTs</p>
        </div>
            )
          : (
        <div className={styles.loading_box}>
          <p>No NFTs, they must be minted first.</p>
        </div>
            )}
    </div>
  )
}
