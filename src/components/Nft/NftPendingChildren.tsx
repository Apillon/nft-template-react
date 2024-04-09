import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BigNumber } from 'ethers'

import { useWeb3Context } from '../../context/Web3Context'
import { transactionError } from '../../lib/utils/errors'
import Spinner from '../Spinner'

const NftPendingChildren = ({ nftId }: { nftId: number }) => {
  const { state, getChildren, getContract, getPendingChildren, getSigner, refreshNfts } = useWeb3Context()

  const [loading, setLoading] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  useEffect(() => {
    getPendingChildren(nftId)
  }, [state, nftId])

  async function acceptChildWrapper(childAddress: string, childId: BigNumber) {
    setLoading(true)
    await acceptChild(nftId, 0, childAddress, childId.toNumber())
    setLoading(false)
  }

  const acceptChild = async (id: number, index: number, childAddress: string, childId: number) => {
    try {
      const nftContract = getContract()
      const tx = await nftContract.connect(await getSigner()).acceptChild(id, index, childAddress, childId)

      toast('Token is being accepted', { type: 'success' })

      await tx.wait()

      await refreshNfts(nftContract)
      getChildren(nftId)
      getPendingChildren(nftId)
    } catch (e) {
      console.log(e)
      transactionError('Token could not be accepted!', e)
    }
  }

  async function rejectChildrenWrapper() {
    setLoadingReject(true)
    await rejectAllChildren(nftId, state.pendingChildren.length)
    setLoadingReject(false)
  }

  const rejectAllChildren = async (parentId: number, pendingChildrenNum = 1) => {
    try {
      const nftContract = getContract()
      const tx = await nftContract.connect(await getSigner()).rejectAllChildren(parentId, pendingChildrenNum)

      toast('Tokens is being rejected', { type: 'success' })

      await tx.wait()

      await refreshNfts(nftContract)
      getPendingChildren(nftId)
    } catch (e) {
      console.log(e)
      transactionError('Tokens could not be rejected!', e)
    }
  }

  return (
    <>
      {state.pendingChildren && state.pendingChildren.length > 0 ? (
        <div>
          {state.pendingChildren.map((child, key) => (
            <div
              key={key}
              className={`pending-child ${key > 0 ? 'opacity-80 pointer-events-none' : ''}`}
              onClick={() => acceptChildWrapper(child.contractAddress, child.tokenId)}
            >
              {loading && key === 0 ? <Spinner /> : <span> Accept Child: {Number(child.tokenId)} </span>}
            </div>
          ))}
          <div className="pending-child" onClick={rejectChildrenWrapper}>
            {loadingReject ? (
              <Spinner />
            ) : state.pendingChildren.length > 1 ? (
              <span>Reject Children</span>
            ) : (
              <span>Reject Child</span>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default NftPendingChildren
