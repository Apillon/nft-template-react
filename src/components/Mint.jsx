import { ethers } from 'ethers'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { nftAbi } from '../lib/abi'
import Spinner from './Spinner'

export default function Mint ({ price, provider, address }) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(1)
  const inputRef = useRef()

  async function mint () {
    setLoading(true)
    const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS

    try {
      const nft = new ethers.Contract(NFT_ADDRESS, nftAbi, provider).connect(
        provider.getSigner()
      )
      const value = price.mul(ethers.BigNumber.from(amount)) // 0.1
      await nft.mint(address, amount, { value })
    } catch (e) {
      toast('Unseccessful mint', { type: 'error' })
      console.error(e)
    }

    setTimeout(() => {
      setLoading(false)
    }, 300)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  return (
    <div className="mint">
      <div className="amount">
        <label htmlFor="amount">Number of tokens (1-5):</label>
        <input
          ref={inputRef}
          type="number"
          min="1"
          max="5"
          value={amount}
          onChange={handleChange}
        />
      </div>
      <button className="btn-mint" id="btnMint" onClick={mint}>
        {loading ? <Spinner /> : 'Mint'}
      </button>
    </div>
  )
}
