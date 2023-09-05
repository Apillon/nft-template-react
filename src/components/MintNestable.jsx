import { BigNumber } from 'ethers'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { transactionError } from '../utils/errors'
import { getContract, isTokenNestable } from '../lib/utils'
import Spinner from './Spinner'
import Btn from './Btn'

export default function MintNestable ({ price, provider, address }) {
  const [loadingMint, setLoadingMint] = useState(false)
  const [loadingNestMint, setLoadingMintNestable] = useState(false)
  const [inputAddress, setInputAddress] = useState('')
  const amount = 1

  async function mintWrapper () {
    setLoadingMint(true)

    mint(process.env.REACT_APP_CONTRACT_ADDRESS)

    setLoadingMint(false)
  }

  async function childMintWrapper () {
    setLoadingMintNestable(true)
    const contractAddress = inputAddress || process.env.REACT_APP_CONTRACT_ADDRESS

    mint(contractAddress)

    setLoadingMintNestable(false)
  }

  async function mint (contractAddress) {
    const nftContract = getContract(contractAddress)
    const isNestable = await isTokenNestable(nftContract)
    if (!isNestable) {
      toast('Token could not be minted! Collection is not nestable.', { type: 'error' })
    } else {
      const value = price.mul(BigNumber.from(amount))

      try {
        const gasLimit = await nftContract
          .connect(provider.getSigner())
          .estimateGas.mint(address, amount, { value })

        await nftContract
          .connect(provider.getSigner())
          .mint(address, amount, { value, gasLimit: gasLimit.mul(11).div(10) })
      } catch (e) {
        transactionError('Unsuccessful mint', e)
        console.error(e)
      }
    }
  }

  const handleChange = (event) => {
    setInputAddress(event.target.value)
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
        <label htmlFor="address">Child Contract Address:</label>
        <input id="address" value={inputAddress} type="text" onChange={handleChange} />
      </div>
      <button disabled={loadingNestMint} onClick={childMintWrapper}>
        {loadingNestMint ? <Spinner/> : 'Mint'}
      </button>
    </div>
  )
}
