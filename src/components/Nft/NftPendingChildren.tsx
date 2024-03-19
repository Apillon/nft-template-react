import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BigNumber } from 'ethers'

import useWeb3Provider from '../../hooks/useWeb3Provider'
import { transactionError } from '../../lib/utils/errors'
import Spinner from '../Spinner'

interface Child {
  contractAddress: string
  tokenId: BigNumber
}

const NftPendingChildren = ({ nftId }: { nftId: number }) => {
  const { getContract, getSigner, refreshNfts } = useWeb3Provider()

  const [pendingChildren, setPendingChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (nftId) {
        const pendingChildren = await getPendingChildren(nftId)
        setPendingChildren(pendingChildren)
      }
    }
    fetchData()
  }, [nftId])

  async function getPendingChildren(parentId: number) {
    try {
      const nftContract = getContract()
      return await nftContract.connect(await getSigner()).pendingChildrenOf(parentId)
    } catch (e) {
      console.log(e)
      return []
    }
  }

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
    } catch (e) {
      console.log(e)
      transactionError('Token could not be accepted!', e)
    }
  }

  async function rejectChildrenWrapper() {
    setLoadingReject(true)
    await rejectAllChildren(nftId, pendingChildren.length)
    setLoadingReject(false)
  }

  const rejectAllChildren = async (parentId: number, pendingChildrenNum = 1) => {
    try {
      const nftContract = getContract()
      const tx = await nftContract.connect(await getSigner()).rejectAllChildren(parentId, pendingChildrenNum)

      toast('Tokens is being rejected', { type: 'success' })

      await tx.wait()
      await refreshNfts(nftContract)
    } catch (e) {
      console.log(e)
      transactionError('Tokens could not be rejected!', e)
    }
  }

  return (
    <>
      {pendingChildren && pendingChildren.length ? (
        <div>
          {pendingChildren.map((child, key) => (
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
            ) : pendingChildren.length > 1 ? (
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
