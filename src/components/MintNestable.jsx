import { ethers } from 'ethers'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import nftAbi from '../lib/nftAbi'
import Btn from './Btn'
import Spinner from './Spinner'

export default function MintNestable ({ price, provider, address }) {
  const [loadingMint, setLoadingMint] = useState(false)
  const [loadingNestMint, setLoadingMintNestable] = useState(false)
  const [amount, setAmount] = useState(1)

  async function mintWrapper () {
    setLoadingMint(true)
    const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS

    try {
      const nft = new ethers.Contract(NFT_ADDRESS, nftAbi, provider).connect(provider.getSigner())
      const value = price.mul(ethers.BigNumber.from(amount)) // 0.1
      await nft.mint(address, amount, { value })
    } catch (e) {
      toast('Unsuccessful mint', { type: 'error' })
      console.error(e)
    }

    setLoadingMint(false)
  }

  async function childMintWrapper () {
    setLoadingMintNestable(true)
    const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS

    try {
      const nft = new ethers.Contract(NFT_ADDRESS, nftAbi, provider).connect(provider.getSigner())
      const value = price.mul(ethers.BigNumber.from(amount)) // 0.1
      await nft.mint(address, amount, { value })
    } catch (e) {
      toast('Unsuccessful mint', { type: 'error' })
      console.error(e)
    }

    setLoadingMintNestable(false)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  return (
    <div className="mintNestable">
      <div>
        <strong>Mint this collection</strong>
        <Btn loading={loadingMint} disabled={loadingMint} onClick={mintWrapper}>
          {loadingMint ? 'Loading...' : 'Mint'}
        </Btn>
      </div>
      <br />
      <div>
        <strong>Or mint another nestable collection</strong>
      </div>
      <br />
      <div className="field">
        <label htmlFor="address">Contract Address:</label>
        <input id="address" value={address} type="text" onChange={handleChange} />
      </div>
      <button disabled={loadingNestMint} onClick={childMintWrapper}>
        {loadingNestMint ? <Spinner/> : 'Mint'}
      </button>
    </div>
  )
}
