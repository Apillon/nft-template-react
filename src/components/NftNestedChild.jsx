import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { getContract, getProvider } from '../lib/utils'
import Spinner from './Spinner'
import Btn from './Btn'
import { toast } from 'react-toastify'
import { transactionError } from '../utils/errors'

const NftNestedChild = ({ parentId, tokenId, contractAddress }) => {
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingTransfer, setLoadingTransfer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childNftContract = getContract(contractAddress)
        const nftUrl = await childNftContract.tokenURI(BigNumber.from(tokenId).toBigInt())

        const response = await fetch(nftUrl)
        const nftData = await response.json()

        setMetadata({
          id: tokenId,
          key: parentId,
          name: nftData.name,
          description: nftData.description,
          image: nftData.image
        })
      } catch (error) {
        console.error(error)

        toast('Apologies, we were unable to load NFT: ' + (tokenId), {
          type: 'error'
        })
      }
      setLoading(false)
    }

    fetchData()
  }, [parentId, tokenId, contractAddress])

  const transferChildWrapper = async (contractAddress, childId) => {
    setLoadingTransfer(true)

    try {
      const nftContract = getContract()
      const provider = getProvider()
      const walletAddress = await provider.getSigner().getAddress()
      await nftContract
        .connect(getProvider().getSigner())
        .transferChild(
          parentId,
          walletAddress,
          0,
          0,
          contractAddress,
          childId,
          false,
          '0x'
        )
      toast('Child is being transferred', { type: 'success' })
    } catch (e) {
      console.log(e)
      transactionError('Token could not be transferred!', e)
    }

    setLoadingTransfer(false)
  }

  return (
    <div>
      {loading
        ? (
        <div className="relative">
          <Spinner />
        </div>
          )
        : (
            metadata &&
        metadata.name && (
          <div className="box">
            <img src={metadata.image} alt={metadata.name} />
            <div className="box-content">
              <h3>#{metadata.id} {metadata.name}</h3>
              <p>{metadata.description}</p>
              <div className="btn-group">
                <Btn
                  loading={loadingTransfer}
                  onClick={() =>
                    transferChildWrapper(contractAddress, tokenId)
                  }
                >
                  Transfer Token to wallet
                </Btn>
              </div>
            </div>
          </div>
            )
          )}
    </div>
  )
}

export default NftNestedChild
