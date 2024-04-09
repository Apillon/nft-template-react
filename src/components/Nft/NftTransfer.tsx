import { BaseSyntheticEvent, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { toast } from 'react-toastify'

import { useWeb3Context } from '../../context/Web3Context'
import Btn from '../Btn'
import { checkInputAddress, checkInputToken, isCollectionNestable } from '../../lib/utils'
import { transactionError } from '../../lib/utils/errors'
import { CONTRACT_ADDRESS } from '../../lib/config'

interface NftTransferProps {
  nftId: number
}

function NftTransfer({ nftId }: NftTransferProps) {
  const [loading, setLoading] = useState(false)
  const { state, getChildren, getContract, getPendingChildren, getSigner, refreshNfts } = useWeb3Context()

  const [address, setAddress] = useState('')
  const [tokenId, setTokenId] = useState(0)

  const nft = state.nfts.find((item) => item.id === nftId)

  const handleChangeAddress = (event: BaseSyntheticEvent) => {
    setAddress(event.target.value)
  }

  const handleChangeTokenId = (event: BaseSyntheticEvent) => {
    setTokenId(Number(event.target.value) || 0)
  }

  async function nestTransferFromWrapper() {
    setLoading(true)

    await getChildren(tokenId)
    await getPendingChildren(tokenId)

    if (state.children.length > 0) {
      toast('This NFT already has children. Please remove his children or use another NFT.', {
        type: 'warning'
      })
    } else if (state.pendingChildren.length > 0) {
      toast('This NFT has pending children. Please reject his pending children or use another NFT.', {
        type: 'warning'
      })
    } else if (checkInputToken(tokenId) && checkInputAddress(address)) {
      await nestTransferFrom(address, CONTRACT_ADDRESS, tokenId, nftId, '0x')
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

        getChildren(nftId)
        getPendingChildren(nftId)
        await refreshNfts(childNftContract)
      } catch (e) {
        console.log(e)
        transactionError('Token could not be transferred! Wrong token address or token ID.', e)
      }
    }
  }

  return (
    <div id="nftTransfer" className="nestable-info nft-transfer">
      <h3>Nesting NFTs from a different smart contract</h3>
      <p>
        To nest NFTs under the #{nft?.id} {nft?.name}, please select the NFTs you want to nest as children.
      </p>

      <div className="btn-group">
        <div className="field">
          <label htmlFor="address">
            Contract Address:
            <a id="contractAddress">
              <img src="images/info.svg" width={16} height={16} />
            </a>
            <Tooltip
              anchorSelect="#contractAddress"
              variant="info"
              content="Enter child collection address from where you want to transfer NFT"
            ></Tooltip>
          </label>
          <input id="address" value={address} type="text" onChange={handleChangeAddress} />
        </div>
        <div className="field tokenId">
          <label htmlFor="tokenId">
            Token ID:
            <a id="tokenIdInfo">
              <img src="images/info.svg" width={16} height={16} />
            </a>
            <Tooltip anchorSelect="#tokenIdInfo" variant="info">
              <span>With Token ID you choose which token you will transfer.</span>
            </Tooltip>
          </label>
          <input value={tokenId} id="tokenId" type="number" min="1" step="1" onChange={handleChangeTokenId} />
        </div>
        <Btn loading={loading} disabled={false} onClick={nestTransferFromWrapper}>
          {nft ? `Nest selected NFT under ${nft.name}` : 'Nest selected NFT'}
        </Btn>
      </div>
    </div>
  )
}

export default NftTransfer
