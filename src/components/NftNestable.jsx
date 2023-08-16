import React, { useState, useEffect } from 'react'
import NftNestedChild from './NftNestedChild'
import { checkInputAddress, checkInputToken, getContract, getProvider, isTokenNestable } from '../lib/utils'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import Spinner from './Spinner'

const NftNestable = ({ nft }) => {
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [loadingNestMint, setLoadingNestMint] = useState(false)
  const [loadingTransferFrom, setLoadingTransferFrom] = useState(false)

  const [addressNestMint, setAddressNestMint] = useState('')
  const [addressTransferFrom, setAddressTransferFrom] = useState('')
  const [tokenTransferFrom, setTokenTransferFrom] = useState(0)

  const [pendingChild, setPendingChild] = useState(null)
  const [pendingChildren, setPendingChildren] = useState([])
  const [hasPendingChildren, setHasPendingChildren] = useState([])
  const [children, setChildren] = useState([])
  const [hasChildren, setHasChildren] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedChildren = await childrenOf(nft.id)
      setChildren(fetchedChildren)

      const fetchedPendingChildren = await pendingChildrenOf(nft.id)
      setPendingChildren(fetchedPendingChildren)

      if (fetchedPendingChildren && fetchedPendingChildren.length) {
        setPendingChild(fetchedPendingChildren[0])
      }
    }
    setHasChildren(Array.isArray(children) && children.length > 0)
    setHasPendingChildren(Array.isArray(pendingChildren) && pendingChildren.length > 0)

    fetchData()
  }, [nft.id])

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
        .acceptChild(nft.id, 0, childAddress, childId)
      toast.success('Token has been accepted')
    } catch (e) {
      console.log(e)
      toast.error('Token could not be accepted!')
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
      toast.success('Tokens has been rejected')
    } catch (e) {
      console.log(e)
      toast.error('Tokens could not be rejected!')
    }

    setLoadingReject(false)
  }

  const childNestMint = async () => {
    setLoadingNestMint(true)

    const childNftContract = getContract(addressNestMint)
    const isNestable = await isTokenNestable(childNftContract)
    if (!isNestable) {
      toast.error('Token could not be minted! Check contract address.')
    } else {
      const nftContract = getContract()
      const price = await nftContract.pricePerMint()
      const value = price.mul(ethers.BigNumber.from(1))
      try {
        await childNftContract
          .connect(getProvider().getSigner())
          .nestMint(nftContract.address, 1, nft.id, { value })
        return true
      } catch (e) {
        console.log(e)
      }
      if (status) {
        toast.success('Token has been minted')
      } else {
        toast.error('Token could not be minted! Check contract address.')
      }
    }

    setLoadingNestMint(false)
  }

  const nestTransferFrom = async () => {
    setLoadingTransferFrom(true)
    const childNftContract = getContract(addressTransferFrom)

    if (checkInputAddress(addressTransferFrom) && checkInputToken(tokenTransferFrom)) {
      console.log('Missing input data')
    } else if (!await isTokenNestable(childNftContract)) {
      toast.error('Child token is not nestable')
    } else {
      try {
        const provider = getProvider()
        const walletAddress = await provider.getSigner().getAddress()
        const toAddress = process.env.REACT_APP_NFT_ADDRESS
        await childNftContract
          .connect(provider.getSigner())
          .nestTransferFrom(walletAddress, toAddress, tokenTransferFrom, nft.id, '0x')

        toast.success('Token has been transferred')
      } catch (e) {
        console.log(e)
        toast.error('Token could not be transferred! Wrong token address or token ID.')
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
          <div id={`nft_${nft.id}`} className="nft">
            <img src={nft.image} className="nft_img" alt={nft.name} />
            <div className="nft_content">
              <h3>{nft.name || `#${nft.id}`}</h3>
              <p>{nft.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="nested-tokens">
        <div className="nestable">
          <div className="nestable-actions">
            <div className="nestable-actions">
              {hasPendingChildren && (
                <div className="btn-group">
                  {pendingChild && (
                    <div className="child-pending">
                      <div>
                        Address: <small>{pendingChild.contractAddress}</small>
                      </div>
                      <div>
                        Id: <strong>{pendingChild.tokenId}</strong>
                      </div>
                    </div>
                  )}
                  {pendingChild && (
                    <div className="actions">
                      <button
                        disabled={loadingAccept}
                        onClick={() =>
                          acceptChild(pendingChild.contractAddress, pendingChild.tokenId)
                        }
                      >
                        {loadingAccept ? 'Loading...' : 'Accept Child'}
                      </button>
                      <button
                        disabled={loadingReject}
                        onClick={() => rejectAllChildren(nft.id, pendingChildren.length)}
                      >
                        {loadingReject ? 'Loading...' : 'Reject All Children'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="btn-group">
                <div className="field">
                  <label htmlFor={`addressNestMint_${nft.id}`}>Contract Address:</label>
                  <input
                    id={`addressNestMint_${nft.id}`}
                    value={addressNestMint}
                    type="text"
                    onChange={handleChangeNestMint}
                  />
                </div>
                <button disabled={loadingNestMint} onClick={childNestMint}>
                  {loadingNestMint ? <Spinner /> : 'Nest Mint'}
                </button>
              </div>
              <div className="btn-group">
                <div className="field">
                  <label htmlFor={`addressTransferFrom_${nft.id}`}>Contract Address:</label>
                  <input
                    id={`addressTransferFrom_${nft.id}`}
                    value={addressTransferFrom}
                    type="text"
                    onChange={handleChangeTransferFrom}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`tokenTransferFrom_${nft.id}`}>Token ID:</label>
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
                  {loadingTransferFrom ? 'Loading...' : 'Nest Transfer From'}
                </button>
              </div>
            </div>
          </div>
          { hasChildren && (
          <div>
            <p>
              <strong>Nested NFTs:</strong>
            </p>
            <div className="grid">
              {children.map((child, key) => (
                <NftNestedChild key={key} parent-id={nft.id} child-nft={child} />
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
