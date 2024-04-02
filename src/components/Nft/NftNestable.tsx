import { useEffect } from 'react'

import { useWeb3Context } from '../../context/Web3Context'
import NftNestedChild from './NftNestedChild'
import NftPendingChildren from './NftPendingChildren'
import Tag from '../Tag'
import NftNesting from './NftNesting'
import CollectionInfo from '../CollectionInfo'
import NftTransfer from './NftTransfer'

interface NftProps {
  nft: Nft
}

const NftNestable = ({ nft }: NftProps) => {
  const { state, getChildren } = useWeb3Context()

  useEffect(() => {
    getChildren(nft.id)
  }, [nft.id])

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
          {state.children?.length > 0 && (
            <div>
              <p>
                <strong>Children</strong>
              </p>
              <div className="grid grid-cols-nft gap-8">
                {state.children.map((child, key) => (
                  <NftNestedChild
                    key={child.tokenId.toNumber()}
                    parentId={nft.id}
                    tokenId={child.tokenId.toNumber()}
                    contractAddress={child.contractAddress}
                    disabled={key > 0}
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
