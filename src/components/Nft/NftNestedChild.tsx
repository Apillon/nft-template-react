import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { transactionError } from '../../lib/utils/errors'
import Spinner from '../Spinner'
import Btn from '../Btn'
import useWeb3Provider from '../../hooks/useWeb3Provider'

interface NftNestedChildProps {
  parentId: number
  tokenId: number
  contractAddress: string
}

const NftNestedChild = ({ parentId, tokenId, contractAddress }: NftNestedChildProps) => {
  const { state, getContract, getSigner, refreshNfts } = useWeb3Provider()

  const [metadata, setMetadata] = useState({} as Nft)
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

        toast('Apologies, we were unable to load NFTs metadata.', {
          type: 'error'
        })
      }
      setLoading(false)
    }

    fetchData()
  }, [parentId, tokenId, contractAddress])

  const transferChildWrapper = async (contractAddress: string, childId: number) => {
    setLoadingTransfer(true)

    try {
      const nftContract = getContract()
      const tx = await nftContract
        .connect(await getSigner())
        .transferChild(parentId, state.walletAddress, 0, 0, contractAddress, childId, false, '0x')
      toast('Child is being transferred', { type: 'success' })

      await tx.wait()
      await refreshNfts(nftContract)
    } catch (e) {
      console.log(e)
      transactionError('Token could not be transferred!', e)
    }

    setLoadingTransfer(false)
  }

  return (
    <div>
      {loading ? (
        <div className="relative">
          <Spinner />
        </div>
      ) : (
        metadata &&
        metadata.name && (
          <div className="box">
            <img src={metadata.image} alt={metadata.name} />
            <div className="box-content">
              <h3>
                #{metadata.id} {metadata.name}
              </h3>
              <p>{metadata.description}</p>
              <div className="btn-group">
                <Btn
                  loading={loadingTransfer}
                  disabled={false}
                  onClick={() => transferChildWrapper(contractAddress, tokenId)}
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
