import { BigNumber } from 'ethers'
import { BaseSyntheticEvent, useState } from 'react'
import { toast } from 'react-toastify'

import useWeb3Provider from '../hooks/useWeb3Provider'
import { CONTRACT_ADDRESS } from '../lib/config'
import { transactionError } from '../lib/utils/errors'
import { checkInputAddress, getContract, isCollectionNestable } from '../lib/utils'
import Btn from './Btn'

interface MintNestableProps {
  nftId: number
}

export default function MintNestable({ nftId }: MintNestableProps) {
  const { state, getSigner, refreshNfts } = useWeb3Provider()

  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState(1)

  async function mintWrapper() {
    setLoading(true)
    if (nftId > 0) {
      childNestMint(address || CONTRACT_ADDRESS, amount)
    } else {
      mint(address || CONTRACT_ADDRESS, amount)
    }
    setLoading(false)
  }

  async function mint(contractAddress: string, quantity: number) {
    const nftContract = getContract(contractAddress)
    const isNestable = await isCollectionNestable(nftContract)
    if (!isNestable) {
      toast('Token could not be minted! Collection is not nestable.', { type: 'error' })
    } else {
      const value = state.collectionInfo?.price.mul(BigNumber.from(quantity))

      try {
        const gasLimit = await nftContract
          .connect(await getSigner())
          .estimateGas.mint(state.walletAddress, quantity, { value })

        const tx = await nftContract
          .connect(await getSigner())
          .mint(state.walletAddress, quantity, { value, gasLimit: gasLimit.mul(11).div(10) })

        toast('Token minting has started', { type: 'success' })

        await tx.wait()
        await refreshNfts(nftContract)
      } catch (e) {
        transactionError('Unsuccessful mint', e)
        console.error(e)
      }
    }
  }

  async function childNestMint(contractAddress: string, quantity: number) {
    if (!checkInputAddress(contractAddress)) {
      console.log('Missing input data')
      return
    }
    const childNftContract = getContract(contractAddress)
    const isNestable = await isCollectionNestable(childNftContract)

    if (!isNestable) {
      toast('Token could not be minted! Collection is not nestable.', { type: 'error' })
    } else {
      const nftContract = getContract()
      const price = await childNftContract.pricePerMint()
      const value = price.mul(BigNumber.from(quantity))

      try {
        const gasLimit = await childNftContract
          .connect(await getSigner())
          .estimateGas.nestMint(nftContract.address, quantity, nftId, { value })

        const tx = await childNftContract
          .connect(await getSigner())
          .nestMint(nftContract.address, quantity, nftId, { value, gasLimit: gasLimit.mul(11).div(10) })

        toast('Token minting has started', { type: 'success' })

        await tx.wait()
        await refreshNfts(childNftContract)
      } catch (e) {
        console.log(e)
        transactionError('Token could not be minted! Check contract address.', e)
      }
    }
  }

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    setAmount(Number(event.target?.value))
  }

  const handleAddressChange = (event: BaseSyntheticEvent) => {
    setAddress(event.target?.value)
  }

  return (
    <div className="mintNestable">
      <div>
        <div className="field amount">
          <label htmlFor="amount">Number of tokens (1-5):</label>
          <input type="number" min="1" max="5" value={amount} onChange={(e) => handleAmountChange(e)} />
        </div>
        {nftId === 0 && (
          <div className="field">
            <label htmlFor="address">Child Contract Address:</label>
            <input id="address" type="text" value={address} onChange={(e) => handleAddressChange(e)} />
          </div>
        )}
        <Btn loading={loading} disabled={false} onClick={() => mintWrapper()}>
          Mint Child
        </Btn>
      </div>
    </div>
  )
}
