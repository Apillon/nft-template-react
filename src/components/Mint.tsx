import { BigNumber } from 'ethers'
import { BaseSyntheticEvent, useState } from 'react'
import Spinner from './Spinner'
import { transactionError } from '../lib/utils/errors'
import { checkInputAmount, getContract } from '../lib/utils'
import { toast } from 'react-toastify'
import useWeb3Provider from '../hooks/useWeb3Provider'
import { CONTRACT_ADDRESS } from '../lib/config'

export default function Mint() {
  const { state } = useWeb3Provider()

  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(1)

  async function mint() {
    setLoading(true)

    if (!checkInputAmount(amount)) {
      toast('Enter amount (1-5)', { type: 'warning' })
      console.log('Wrong amount number')
      return
    } else if (!state.signer) {
      console.debug('Missing signer')
      return
    } else if (!state.collectionInfo) {
      console.debug('Missing collection data')
      return
    }
    try {
      const nftContract = getContract(CONTRACT_ADDRESS)
      const value = state.collectionInfo.price.mul(BigNumber.from(amount))

      const gasLimit = await nftContract.connect(state.signer).estimateGas.mint(state.walletAddress, amount, { value })

      await nftContract
        .connect(state.signer)
        .mint(state.walletAddress, amount, { value, gasLimit: gasLimit.mul(11).div(10) })

      toast('Token is being minted', { type: 'success' })
    } catch (e) {
      transactionError('Unsuccessful mint', e)
      console.error(e)
    }

    setTimeout(() => {
      setLoading(false)
    }, 300)
  }

  const handleChange = (event: BaseSyntheticEvent) => {
    setAmount(event.target.value)
  }

  return (
    <div className="mint">
      <div className="amount">
        <label htmlFor="amount">Number of tokens (1-5):</label>
        <input type="number" min="1" max="5" value={amount} onChange={() => handleChange} />
      </div>
      <button className="btn-mint" id="btnMint" onClick={() => mint}>
        {loading ? <Spinner /> : 'Mint'}
      </button>
    </div>
  )
}
