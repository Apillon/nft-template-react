import { useState, useEffect } from 'react'
import NftNestedChild from './NftNestedChild'
import NftPendingChildren from './NftPendingChildren'
import Tag from '../Tag'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import NftNesting from './NftNesting'
import CollectionInfo from '../CollectionInfo'
import NftTransfer from './NftTransfer'
import { getContract } from '../../lib/utils'

interface NftProps {
  nft: Nft
}

const NftNestable = ({ nft }: NftProps) => {
  const { state, getSigner } = useWeb3Provider()

  const [children, setChildren] = useState([] as Array<Child>)
  const [hasChildren, setHasChildren] = useState(false)

  useEffect(() => {
    fetchData()
  }, [nft.id])

  const fetchData = async () => {
    // Children
    const fetchedChildren = await childrenOf(nft.id)
    setChildren(fetchedChildren)
    setHasChildren(Array.isArray(fetchedChildren) && fetchedChildren.length > 0)
  }

  /** Nestable NFT */
  async function childrenOf(parentId: number) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(await getSigner()).childrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  return (
    <div>
      <div className="parent-token">
        <div className="parent-token">
          <div id={`nft_${nft.id}`} className="nft">
            <div className="relative">
              <img src={nft.image} className="h-full object-contain" alt={nft.name} />
              <div className="absolute top-3 left-0 flex flex-col">{state.isNestable && <Tag>Nestable</Tag>}</div>
              <div className="absolute top-3 right-0 flex flex-col z-10">
                <NftPendingChildren nftId={nft.id} />
              </div>
            </div>

            <div className="pt-4 px-6 pb-6">
              <h3>
                #{nft.id} {nft.name}
              </h3>
              <p>{nft.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="nested-tokens">
        <div className="nestable">
          {hasChildren && (
            <div>
              <p>
                <strong>Children</strong>
              </p>
              <div className="grid grid-cols-nft gap-8">
                {children.map((child) => (
                  <NftNestedChild
                    key={child.tokenId.toNumber()}
                    parentId={nft.id}
                    tokenId={child.tokenId.toNumber()}
                    contractAddress={child.contractAddress}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-12 my-12">
          <NftNesting nftId={nft.id} />

          <div>
            <div className="box collection rounded-xl text-center">
              <CollectionInfo nftId={nft.id} />
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto my-12">
          <NftTransfer nftId={nft.id} />
        </div>
      </div>
    </div>
  )
}

export default NftNestable
