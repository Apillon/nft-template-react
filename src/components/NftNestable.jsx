import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'

import { checkInputAddress, checkInputToken, getContract, getProvider, isTokenNestable } from '../lib/utils'
import { transactionError } from '../utils/errors'
import NftNestedChild from './NftNestedChild'
import { BigNumber } from 'ethers'
import Spinner from './Spinner'
import Btn from './Btn'

const NftNestable = ({ nftId, nftName, nftDescription, nftImage }) => {
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [loadingNestMint, setLoadingNestMint] = useState(false)
  const [loadingTransferFrom, setLoadingTransferFrom] = useState(false)

  const [addressNestMint, setAddressNestMint] = useState(process.env.REACT_APP_NFT_ADDRESS)
  const [addressTransferFrom, setAddressTransferFrom] = useState(process.env.REACT_APP_NFT_ADDRESS)
  const [tokenTransferFrom, setTokenTransferFrom] = useState(0)

  const [pendingChild, setPendingChild] = useState({})
  const [pendingChildren, setPendingChildren] = useState([])
  const [hasPendingChildren, setHasPendingChildren] = useState(false)
  const [children, setChildren] = useState([])
  const [hasChildren, setHasChildren] = useState(false)

  useEffect(() => {
    fetchData()
  }, [nftId])
  const fetchData = async () => {
    // Children
    const fetchedChildren = await childrenOf(nftId)
    setChildren(fetchedChildren)
    setHasChildren(Array.isArray(fetchedChildren) && fetchedChildren.length > 0)

    // Pending Children
    const fetchedPendingChildren = await pendingChildrenOf(nftId)
    setPendingChildren(fetchedPendingChildren)

    const hasPending = (Array.isArray(fetchedPendingChildren) && fetchedPendingChildren.length > 0)
    setHasPendingChildren(hasPending)
    if (hasPending) {
      setPendingChild(fetchedPendingChildren[0])
    }
  }

  /** Nestable NFT */
  async function childrenOf (parentId) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(getProvider().getSigner()).childrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async function pendingChildrenOf (parentId) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(getProvider().getSigner()).pendingChildrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const acceptChild = async (childAddress, childId) => {
    setLoadingAccept(true)

    try {
      const nftContract = getContract()
      await nftContract
        .connect(getProvider().getSigner())
        .acceptChild(nftId, 0, childAddress, childId)
      toast('Token is being accepted', { type: 'success' })
    } catch (e) {
      console.log(e)
      transactionError('Token could not be accepted!', e)
    }

    setLoadingAccept(false)
  }

  const rejectAllChildren = async (parentId, pendingChildrenNum = 1) => {
    setLoadingReject(true)

    try {
      const nftContract = getContract()
      await nftContract
        .connect(getProvider().getSigner())
        .rejectAllChildren(parentId, pendingChildrenNum)
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
    const isNestable = await isTokenNestable(childNftContract)

    if (!isNestable) {
      toast('Token could not be minted! Collection is not nestable.', { type: 'error' })
    } else {
      const nftContract = getContract()
      const price = await childNftContract.pricePerMint()
      const value = price.mul(BigNumber.from(1))

      try {
        const gasLimit = await childNftContract
          .connect(getProvider().getSigner())
          .estimateGas.nestMint(nftContract.address, 1, nftId, { value })

        await childNftContract
          .connect(getProvider().getSigner())
          .nestMint(nftContract.address, 1, nftId, { value, gasLimit: gasLimit.mul(11).div(10) })

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
    } else if (!await isTokenNestable(childNftContract)) {
      toast('Child token is not nestable', { type: 'error' })
    } else {
      try {
        const provider = getProvider()
        const walletAddress = await provider.getSigner().getAddress()
        const toAddress = process.env.REACT_APP_NFT_ADDRESS

        await childNftContract
          .connect(provider.getSigner())
          .nestTransferFrom(walletAddress, toAddress, tokenTransferFrom, nftId, '0x')

        toast('Token is being transferred', { type: 'success' })
      } catch (e) {
        console.log(e)
        transactionError('Token could not be transferred! Wrong token address or token ID.', e)
      }
    }
    setLoadingTransferFrom(false)
  }

  const handleChangeNestMint = (event) => {
    setAddressNestMint(event.target.value)
  }

  const handleChangeTransferFrom = (event) => {
    setAddressTransferFrom(event.target.value)
  }

  const handleChangeTokenTransferFrom = (event) => {
    setTokenTransferFrom(Number(event.target.value) || 1)
  }

  return (
    <div>
      <div className="parent-token">
        <div className="parent-token">
          <div id={`nft_${nftId}`} className="nft">
            <img src={nftImage} className="nft_img" alt={nftName} />
            <div className="nft_content">
              <h3>#{nftId} {nftName}</h3>
              <p>{nftDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="nested-tokens">
        <div className="nestable">
          <div className="nestable-actions">

              {hasPendingChildren && (
                <div className="btn-group">
                  {pendingChild && pendingChild.tokenId && (
                    <div className="child-pending">
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
                        onClick={() =>
                          acceptChild(pendingChild.contractAddress, pendingChild.tokenId)
                        }
                      >
                        Accept Child
                      </Btn>
                      <Btn
                        disabled={loadingReject}
                        loading={loadingReject}
                        onClick={() => rejectAllChildren(nftId, pendingChildren.length)}
                      >
                        Reject All Children
                      </Btn>
                    </div>
                  )}
                </div>
              )}

              <div className="btn-group">
                <div className="field">
                  <label htmlFor={`addressNestMint_${nftId}`}>
                    <span>Contract Address</span>
                    <a id={`infoNestMint_${nftId}`}>
                      <img src="images/info.svg" width={16} height={16} />
                    </a>
                    <Tooltip anchorSelect={`#infoNestMint_${nftId}`}type='warning' effect='solid'>
                      <span>Enter collection address from where you want to mint NFT and transfer it to this NFT. Initial address is from this collection.</span>
                    </Tooltip>
                  </label>
                  <input
                    id={`addressNestMint_${nftId}`}
                    value={addressNestMint}
                    type="text"
                    onChange={handleChangeNestMint}
                  />
                </div>
                <button disabled={loadingNestMint} onClick={childNestMint}>
                  {loadingNestMint ? <Spinner /> : 'Mint Child'}
                </button>
              </div>
              <div className="btn-group">
                <div className="field">
                  <label htmlFor={`addressTransferFrom_${nftId}`}>
                    <span>Contract Address</span>
                    <a id={`infoTransferFrom_${nftId}`}>
                      <img src="images/info.svg" width={16} height={16} />
                    </a>
                    <Tooltip anchorSelect={`#infoTransferFrom_${nftId}`}type='warning' effect='solid'>
                      <span>Enter collection address from where you want to transfer NFT. Initial address is from this collection.</span>
                    </Tooltip>
                  </label>
                  <input
                    id={`addressTransferFrom_${nftId}`}
                    value={addressTransferFrom}
                    type="text"
                    onChange={handleChangeTransferFrom}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`tokenTransferFrom_${nftId}`}>
                    <span>Token ID</span>
                    <a id={`infoTransferFromTokenId_${nftId}`}>
                      <img src="images/info.svg" width={16} height={16} />
                    </a>
                    <Tooltip anchorSelect={`#infoTransferFromTokenId_${nftId}`}type='warning' effect='solid'>
                      <span>With Token ID you choose which token you will transfer.</span>
                    </Tooltip></label>
                  <input
                    id={`tokenTransferFrom_${nftId}`}
                    value={tokenTransferFrom}
                    type="number"
                    min={1}
                    step={1}
                    onChange={handleChangeTokenTransferFrom}
                  />
                </div>
                <button disabled={loadingTransferFrom} onClick={nestTransferFrom}>
                  {loadingTransferFrom ? <Spinner /> : 'Nest Transfer From'}
                </button>
              </div>
            </div>
           { hasChildren && (
            <div>
              <p>
                <strong>Nested NFTs:</strong>
              </p>
              <div className="grid">
                 {children.map((child) => (
                  <NftNestedChild
                    key={child.tokenId.toNumber()}
                    parentId={nftId}
                    tokenId={child.tokenId.toNumber()}
                    contractAddress={child.contractAddress} />
                 ))}
              </div>
            </div>
           ) }
        </div>
      </div>
    </div>
  )
}

export default NftNestable
