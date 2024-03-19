import { BaseSyntheticEvent, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import useWeb3Provider from '../../hooks/useWeb3Provider'
import { transactionError } from '../../lib/utils/errors'
import { checkInputToken, isCollectionNestable } from '../../lib/utils'
import NftCard from './NftCard'
import Btn from '../Btn'
import { CONTRACT_ADDRESS } from '../../lib/config'

interface NftNestingProps {
  nftId: number
}

function NftNesting({ nftId }: NftNestingProps) {
  const { state, getContract, getSigner, refreshNfts } = useWeb3Provider()

  const [loading, setLoading] = useState(false)
  const [tokenId, setTokenId] = useState(0)

  const nfts = useMemo(() => {
    return state.nfts.filter((item) => item.id !== nftId && state.myNftIDs.includes(item.id))
  }, [state.nfts, state.filterByWallet])

  function handleChange(event: BaseSyntheticEvent) {
    setTokenId(Number(event.target.value) || 0)
  }

  async function getChildren(parentId: number) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(await getSigner()).childrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }
  async function getPendingChildren(parentId: number) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(await getSigner()).pendingChildrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async function nestTransferFromWrapper() {
    setLoading(true)
    const children = await getChildren(tokenId)
    const pendingChildren = await getPendingChildren(tokenId)

    if (children.length > 0) {
      toast('This NFT already has children. Please remove his children or use another NFT.', {
        type: 'warning'
      })
    } else if (pendingChildren.length > 0) {
      toast('This NFT has pending children. Please reject his pending children or use another NFT.', {
        type: 'warning'
      })
    } else if (checkInputToken(tokenId)) {
      await nestTransferFrom(CONTRACT_ADDRESS, CONTRACT_ADDRESS, tokenId, nftId, '0x')
    }
    setLoading(false)
  }

  async function nestTransferFrom(
    tokenAddress: string,
    toAddress: string,
    tokenId: number,
    destinationId: number,
    data: any
  ) {
    const childNftContract = getContract(tokenAddress)

    if (!(await isCollectionNestable(childNftContract))) {
      toast('Child token is not nestable', { type: 'error' })
    } else {
      try {
        const tx = await childNftContract
          .connect(await getSigner())
          .nestTransferFrom(state.walletAddress, toAddress, tokenId, destinationId, data)

        toast('Token is being transferred', { type: 'success' })

        await tx.wait()
        await refreshNfts(childNftContract)
      } catch (e) {
        console.log(e)
        transactionError('Token could not be transferred! Wrong token address or token ID.', e)
      }
    }
  }

  return (
    <div>
      <h3>Nesting NFTs from the same smart contract</h3>
      <p>
        To nest NFTs under the #1 Semper Space White black gold, please select the NFTs you want to nest as children.
      </p>

      <div className="grid grid-cols-small gap-8">
        {nfts.map((nft, key) => (
          <div key={key} className={`relative ${nft.id === nftId ? 'hidden' : ''}`}>
            <input
              type="radio"
              className="absolute"
              name="nest"
              id={`nft_${nft.id}`}
              value={nft.id}
              onChange={handleChange}
            />
            <label htmlFor={`nft_${nft.id}`}>
              <NftCard nft={nft} open={false} />
            </label>
          </div>
        ))}
      </div>
      <br />
      <Btn loading={loading} disabled={false} onClick={() => nestTransferFromWrapper()}>
        Nest selected NFT
      </Btn>
    </div>
  )
}

export default NftNesting
