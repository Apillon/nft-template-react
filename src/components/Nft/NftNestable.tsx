import { useState, useEffect, BaseSyntheticEvent } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { BigNumber } from 'ethers'

import { checkInputAddress, checkInputToken, getContract, isCollectionNestable } from '../../lib/utils'
import { transactionError } from '../../lib/utils/errors'
import NftNestedChild from './NftNestedChild'
import NftPendingChildren from './NftPendingChildren'
import Spinner from '../Spinner'
import Btn from '../Btn'
import Tag from '../Tag'
import { CONTRACT_ADDRESS } from '../../lib/config'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import NftNesting from './NftNesting'
import CollectionInfo from '../CollectionInfo'
import NftTransfer from './NftTransfer'

interface NftProps {
  nft: Nft
}

const NftNestable = ({ nft }: NftProps) => {
  const { state, getProvider, getSigner } = useWeb3Provider()

  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [loadingNestMint, setLoadingNestMint] = useState(false)
  const [loadingTransferFrom, setLoadingTransferFrom] = useState(false)

  const [addressNestMint, setAddressNestMint] = useState(CONTRACT_ADDRESS)
  const [addressTransferFrom, setAddressTransferFrom] = useState(CONTRACT_ADDRESS)
  const [tokenTransferFrom, setTokenTransferFrom] = useState(0)

  const [pendingChild, setPendingChild] = useState({} as Child)
  const [pendingChildren, setPendingChildren] = useState([])
  const [hasPendingChildren, setHasPendingChildren] = useState(false)
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

    // Pending Children
    const fetchedPendingChildren = await pendingChildrenOf(nft.id)
    setPendingChildren(fetchedPendingChildren)

    const hasPending = Array.isArray(fetchedPendingChildren) && fetchedPendingChildren.length > 0
    setHasPendingChildren(hasPending)
    if (hasPending) {
      setPendingChild(fetchedPendingChildren[0])
    }
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

  async function pendingChildrenOf(parentId: number) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(await getSigner()).pendingChildrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const acceptChild = async (childAddress: string, childId: number) => {
    setLoadingAccept(true)

    try {
      const nftContract = getContract()
      await nftContract.connect(await getSigner()).acceptChild(nft.id, 0, childAddress, childId)
      toast('Token is being accepted', { type: 'success' })
    } catch (e) {
      console.log(e)
      transactionError('Token could not be accepted!', e)
    }

    setLoadingAccept(false)
  }

  const rejectAllChildren = async (parentId: number, pendingChildrenNum = 1) => {
    setLoadingReject(true)

    try {
      const nftContract = getContract()
      await nftContract.connect(await getSigner()).rejectAllChildren(parentId, pendingChildrenNum)
      toast('Tokens is being rejected', { type: 'success' })
    } catch (e) {
      console.log(e)
      transactionError('Tokens could not be rejected!', e)
    }

    setLoadingReject(false)
  }

  const childNestMint = async () => {
    setLoadingNestMint(true)

    if (!checkInputAddress(addressNestMint)) {
      console.log('Missing input data')
      setLoadingNestMint(false)
      return
    }
    const childNftContract = getContract(addressNestMint)
    const isNestable = await isCollectionNestable(childNftContract)

    if (!isNestable) {
      toast('Token could not be minted! Collection is not nestable.', { type: 'error' })
    } else {
      const nftContract = getContract()
      const price = await childNftContract.pricePerMint()
      const value = price.mul(BigNumber.from(1))

      try {
        const gasLimit = await childNftContract
          .connect(await getSigner())
          .estimateGas.nestMint(nftContract.address, 1, nft.id, { value })

        await childNftContract
          .connect(await getSigner())
          .nestMint(nftContract.address, 1, nft.id, { value, gasLimit: gasLimit.mul(11).div(10) })

        toast('Token is being minted', { type: 'success' })
      } catch (e) {
        console.log(e)
        transactionError('Token could not be minted! Check contract address.', e)
      }
    }

    setLoadingNestMint(false)
  }

  const nestTransferFrom = async () => {
    setLoadingTransferFrom(true)
    const childNftContract = getContract(addressTransferFrom)

    if (!checkInputAddress(addressTransferFrom) || !checkInputToken(tokenTransferFrom)) {
      console.log('Missing input data')
    } else if (!(await isCollectionNestable(childNftContract))) {
      toast('Child token is not nestable', { type: 'error' })
    } else {
      try {
        const provider = getProvider()
        const walletAddress = await provider.getSigner().getAddress()
        const toAddress = import.meta.env.VITE_CONTRACT_ADDRESS

        await childNftContract
          .connect(provider.getSigner())
          .nestTransferFrom(walletAddress, toAddress, tokenTransferFrom, nft.id, '0x')

        toast('Token is being transferred', { type: 'success' })
      } catch (e) {
        console.log(e)
        transactionError('Token could not be transferred! Wrong token address or token ID.', e)
      }
    }
    setLoadingTransferFrom(false)
  }

  const handleChangeNestMint = (event: BaseSyntheticEvent) => {
    setAddressNestMint(event.target.value)
  }

  const handleChangeTransferFrom = (event: BaseSyntheticEvent) => {
    setAddressTransferFrom(event.target.value)
  }

  const handleChangeTokenTransferFrom = (event: BaseSyntheticEvent) => {
    setTokenTransferFrom(Number(event.target.value) || 1)
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
          {/* <div className="nestable-actions">
            {hasPendingChildren && (
              <div className="btn-group">
                {pendingChild && pendingChild.tokenId && (
                  <div className="mb-4">
                    <div>
                      Address: <small>{pendingChild.contractAddress}</small>
                    </div>
                    <div>
                      Id: <strong>{pendingChild.tokenId.toNumber()}</strong>
                    </div>
                  </div>
                )}
                {pendingChild && (
                  <div className="actions">
                    <Btn
                      disabled={loadingAccept}
                      loading={loadingAccept}
                      onClick={() => acceptChild(pendingChild.contractAddress, Number(pendingChild.tokenId))}
                    >
                      Accept Child
                    </Btn>
                    <Btn
                      disabled={loadingReject}
                      loading={loadingReject}
                      onClick={() => rejectAllChildren(nft.id, pendingChildren.length)}
                    >
                      Reject All Children
                    </Btn>
                  </div>
                )}
              </div>
            )}

            <div className="btn-group">
              <div className="field">
                <label htmlFor={`addressNestMint_${nft.id}`}>
                  <span>Child Contract Address</span>
                  <a id={`infoNestMint_${nft.id}`}>
                    <img src="images/info.svg" width={16} height={16} />
                  </a>
                  <Tooltip anchorSelect={`#infoNestMint_${nft.id}`} variant="warning">
                    <span>
                      Enter child collection address from where you want to mint NFT and transfer it to this NFT.
                      Initial address is from this collection.
                    </span>
                  </Tooltip>
                </label>
                <input
                  id={`addressNestMint_${nft.id}`}
                  value={addressNestMint}
                  type="text"
                  onChange={handleChangeNestMint}
                />
              </div>
              <button disabled={loadingNestMint} onClick={childNestMint}>
                {loadingNestMint ? <Spinner /> : `Nest Mint Child under ${nft.name}`}
              </button>
            </div>
            <div className="btn-group">
              <div className="field">
                <label htmlFor={`addressTransferFrom_${nft.id}`}>
                  <span>Child Contract Address</span>
                  <a id={`infoTransferFrom_${nft.id}`}>
                    <img src="images/info.svg" width={16} height={16} />
                  </a>
                  <Tooltip anchorSelect={`#infoTransferFrom_${nft.id}`} variant="warning">
                    <span>
                      Enter child collection address from where you want to transfer NFT. Initial address is from this
                      collection.
                    </span>
                  </Tooltip>
                </label>
                <input
                  id={`addressTransferFrom_${nft.id}`}
                  value={addressTransferFrom}
                  type="text"
                  onChange={handleChangeTransferFrom}
                />
              </div>
              <div className="field">
                <label htmlFor={`tokenTransferFrom_${nft.id}`}>
                  <span>Token ID</span>
                  <a id={`infoTransferFromTokenId_${nft.id}`}>
                    <img src="images/info.svg" width={16} height={16} />
                  </a>
                  <Tooltip anchorSelect={`#infoTransferFromTokenId_${nft.id}`} variant="warning">
                    <span>With Token ID you choose which token you will transfer.</span>
                  </Tooltip>
                </label>
                <input
                  id={`tokenTransferFrom_${nft.id}`}
                  value={tokenTransferFrom}
                  type="number"
                  min={1}
                  step={1}
                  onChange={handleChangeTokenTransferFrom}
                />
              </div>
              <button disabled={loadingTransferFrom} onClick={nestTransferFrom}>
                {loadingTransferFrom ? <Spinner /> : `Nest NFT under ${nft.name}`}
              </button>
            </div>
          </div> */}

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
