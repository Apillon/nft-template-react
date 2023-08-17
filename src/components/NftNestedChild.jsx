import React, { useEffect, useState } from 'react'
import { getContract, getProvider } from '../lib/utils'
import Spinner from './Spinner'
import Btn from './Btn'
import { toast } from 'react-toastify'
import { transactionError } from '../utils/errors'

const NftNestedChild = ({ parentId, childNft }) => {
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingTransfer, setLoadingTransfer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childNftContract = getContract(childNft.contractAddress)
        const nftUrl = await childNftContract.tokenURI(childNft.tokenId.toBigInt())

        const response = await fetch(nftUrl)
        const nftData = await response.json()

        setMetadata({
          id: childNft.tokenId.toNumber(),
          key: parentId,
          name: nftData.name,
          description: nftData.description,
          image: nftData.image
        })
      } catch (error) {
        console.error(error)

        toast('Apologies, we were unable to load NFT: ' + (childNft.tokenId.toNumber()), {
          type: 'error'
        })
      }
      setLoading(false)
    }

    fetchData()
  }, [childNft, parentId])

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
      toast('Child has been transferred', { type: 'success' })
    } catch (e) {
      console.log(e)
      transactionError('Token could not be transferred! Wrong token address or token ID.', e)
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
              <h3>{metadata.name || `#${metadata.id}`}</h3>
              <p>{metadata.description}</p>
              <div className="btn-group">
                <Btn
                  loading={loadingTransfer}
                  onClick={() =>
                    transferChildWrapper(childNft.contractAddress, childNft.tokenId.toNumber())
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
