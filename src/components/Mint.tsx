import { BigNumber } from 'ethers'
import React, { useRef, useState } from 'react'
import Spinner from './Spinner'
import { transactionError } from '../utils/errors'
import { checkInputAmount, getContract } from '../lib/utils'
import { toast } from 'react-toastify'

export default function Mint ({ price, provider, address }) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(1)
  const inputRef = useRef()

  async function mint () {
    setLoading(true)
    const NFT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

    if (!checkInputAmount(amount)) {
      console.log('Wrong amount number')
      return
    }
    try {
      const nftContract = getContract(NFT_ADDRESS)
      const value = price.mul(BigNumber.from(amount))

      const gasLimit = await nftContract
        .connect(provider.getSigner())
        .estimateGas.mint(address, amount, { value })

      await nftContract
        .connect(provider.getSigner())
        .mint(address, amount, { value, gasLimit: gasLimit.mul(11).div(10) })

      toast('Token is being minted', { type: 'success' })
    } catch (e) {
      transactionError('Unsuccessful mint', e)
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
