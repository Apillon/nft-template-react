import React from 'react'
// import Btn from './Btn'

const NftNestedChild = ({ parentId, childNft }) => {
  /*
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingTransfer, setLoadingTransfer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childNftContract = getNftContract(childNft.contractAddress)
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
        // Handle error
      }
      setLoading(false)
    }

    fetchData()
  }, [childNft.contractAddress, childNft.tokenId, parentId, getNftContract])

  const transferChildWrapper = async (contractAddress, childId) => {
    setLoadingTransfer(true)

    const status = await transferChild(
      parentId,
      state.walletAddress,
      0,
      0,
      contractAddress,
      childId,
      false,
      '0x'
    )

    if (status) {
      // Replace useNuxtApp().$toast.success with your toast notification logic
    } else {
      // Replace useNuxtApp().$toast.error with your toast notification logic
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
*/
  return (
  <div></div>
  )
}

export default NftNestedChild
