import styles from '../styles/NftCard.module.css'
import React from 'react'

export default function NftCard ({ id, nft }) {
  return (
    <div className={styles.nft} id={'nft_' + id}>
      <img src={nft.image} className={styles.nft_img} alt={nft.name} />
      <div className={styles.nft_content}>
        <h3>{nft.name || `#${id}`}</h3>
        <p>{nft.description}</p>
      </div>
    </div>
  )
}
