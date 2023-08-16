import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { toast } from 'react-toastify'

import { addChain, getCurrentChain, switchChain, metamaskNotSupportedMessage, getProvider, getContract, isTokenNestable, getMyNftIDs } from '../lib/utils'
import Btn from './Btn'
import NftGallery from './NftGallery'
import CollectionInfo from './CollectionInfo'
import Spinner from './Spinner'
import IconWallet from './IconWallet'

export default function Main () {
  const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [address, setAddress] = useState()

  const [loading, setLoading] = useState(false)
  const [loadingNfts, setLoadingNfts] = useState(false)
  const [loadingMyNfts, setLoadingMyNfts] = useState(false)

  const [currentChain, setCurrentChain] = useState()
  const [collectionInfo, setCollectionInfo] = useState(null)
  const [collectionNestable, setCollectionNestable] = useState(null)
  const [myNFTs, setMyNFTs] = useState([])

  const [nfts] = useState([])
  const [filterByAddress, setFilterByAddress] = useState(false)

  const setupProvider = () => {
    if (provider) return provider

    const newProvider = getProvider()
    setProvider(newProvider)

    return newProvider
  }
  const setupContract = () => {
    if (contract) return contract

    const newContract = getContract()
    setContract(newContract)

    return newContract
  }
  const setupCurrentChain = async () => {
    if (currentChain) return currentChain

    const newCurrentChain = await getCurrentChain()
    setCurrentChain(newCurrentChain)

    return newCurrentChain
  }
  const setupAddress = async () => {
    if (address) return address

    const provider = setupProvider()
    const newAddress = await provider.getSigner().getAddress()
    setAddress(newAddress)

    return newAddress
  }
  const setupCollectionInfo = async () => {
    if (collectionInfo) return collectionInfo

    const newInfo = await getCollectionInfo()
    setCollectionInfo(newInfo)

    return newInfo
  }
  const setupCollectionType = async () => {
    if (collectionNestable !== null) return collectionNestable

    const collectionType = await isTokenNestable(setupContract())
    setCollectionNestable(collectionType)

    return collectionType
  }
  const setupMyNFTs = async () => {
    if (Array.isArray(myNFTs) && myNFTs.length > 0) return myNFTs

    const nfts = await getMyNftIDs(setupContract(), setupAddress())
    setMyNFTs(nfts)

    return nfts
  }

  async function connectWallet () {
    const { ethereum } = window
    if (!ethereum) {
      toast(metamaskNotSupportedMessage(), { type: 'error' })
      return
    }
    setLoading(true)

    setupProvider()
    setupContract()

    let currentChain = null
    try {
      currentChain = await setupCurrentChain()
    } catch (error) {
      console.log(error)
    }

    if (currentChain !== CHAIN_ID) {
      try {
        await switchChain(CHAIN_ID)

        setupProvider()
        setupContract()
        currentChain = await setupCurrentChain()
      } catch (e) {
        toast('Error connecting to metamask', { type: 'error' })

        try {
          await addChain(CHAIN_ID)
        } catch (e) {
          toast('' + e, { type: 'error' })
        }
      }
    }

    /** Check if collection is Nestable */
    setupCollectionType()

    await ethereum.request({
      method: 'eth_requestAccounts'
    })

    setupAddress()

    try {
      await setupCollectionInfo()
    } catch (e) {
      console.error(e)
      toast('Provided NFT collection address is invalid! Please check NFT address and Chain ID.', {
        type: 'error'
      })
      setLoading(false)
      return
    }

    setupMyNFTs()

    await loadAllNFTs()
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }

  async function getCollectionInfo () {
    const contract = setupContract()
    return {
      name: await contract.name(),
      symbol: await contract.symbol(),
      maxSupply: await contract.maxSupply(),
      totalSupply: await contract.totalSupply(),
      soulbound: await contract.isSoulbound(),
      revokable: await contract.isRevokable(),
      drop: await contract.isDrop(),
      dropStart: await contract.dropStart(),
      reserve: await contract.reserve(),
      price: BigNumber.from('4'),
      royaltiesFees: BigNumber.from('42'),
      royaltiesAddress: ''
      // price: await contract.price(),
      // royaltiesFees: await contract.royaltiesFees(),
      // royaltiesAddress: await contract.royaltiesAddress()
    }
  }

  async function loadAllNFTs () {
    setLoadingNfts(true)
    setFilterByAddress(false)

    const collectionInfo = await setupCollectionInfo()
    if (collectionInfo) {
      await fetchNFTs(collectionInfo.totalSupply)
    }
    setLoadingNfts(false)
  }

  async function loadMyNFTs () {
    setLoadingMyNfts(true)
    setFilterByAddress(true)

    const address = setupAddress()
    const contract = setupContract()
    const balance = await contract.balanceOf(address)

    await fetchNFTs(balance, address)
    setLoadingMyNfts(false)
  }

  async function fetchNFTs (balance, address = null) {
    clearNfts()
    if (balance.toBigInt() === 0) {
      return
    }
    const contract = setupContract()

    for (let i = 0; i < balance.toBigInt(); i++) {
      try {
        const id = address
          ? await contract.tokenOfOwnerByIndex(address, i)
          : await contract.tokenByIndex(i)
        const url = await contract.tokenURI(id.toBigInt())
        const metadata = await fetch(url).then((response) => {
          return response.json()
        })
        nfts.push({ id: i, ...metadata })
      } catch (e) {
        console.error(e)

        toast('Apologies, we were unable to load NFT: ' + (i + 1), {
          type: 'error'
        })
      }
    }
  }

  function clearNfts () {
    while (nfts && nfts.length > 0) {
      nfts.pop()
    }
  }

  return (
    <div>
      <div className="box collection br text-center">
        {/* Collection loaded */}
        {collectionInfo && (
          <CollectionInfo
            collection={collectionInfo}
            provider={provider}
            address={address}
            isCollectionNestable={collectionNestable}
          />
        )}

        <div className="btn-connect-wrapper">
          <Btn loading={loading} id="btnConnect" onClick={() => connectWallet()}>
            {address
              ? (
              <span className='address'>
                <IconWallet /> {address.slice(0, 11)}
              </span>
                )
              : (
                  'Connect wallet'
                )}
          </Btn>
        </div>
      </div>

      {/* Wallet connected */}
      {address && collectionInfo && (
        <div id="actions">
          <h2 className="text-center">Show NFTs:</h2>
          <div className="actions">
            <button id="btnAllNFTs" onClick={() => loadAllNFTs()}>
              {loadingNfts ? <Spinner /> : 'All nfts'}
            </button>
            <button id="myNFTs" onClick={() => loadMyNFTs()}>
              {loadingMyNfts ? <Spinner /> : 'My nfts'}
            </button>
          </div>
        </div>
      )}

      {/* Collection loaded */}
      {collectionInfo && (
        <div>
          {(() => {
            if (collectionInfo.totalSupply === 0) {
              return <h2 className="text-center">No NFTs, they must be minted first.</h2>
            } else if (filterByAddress && !nfts) {
              return <h2 className="text-center">You don`t have any NFTs</h2>
            } else if (!nfts) {
              return <h2 className="text-center">No NFTs, they must be minted first.</h2>
            } else {
              return <NftGallery address={address} nfts={nfts} isCollectionNestable={collectionNestable} myNFTs={myNFTs} />
            }
          })()}
        </div>
      )}
    </div>
  )
}
