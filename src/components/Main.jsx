import React, { useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { nftAbi } from '../lib/abi'

import { addChain, getCurrentChain, switchChain, metamaskNotSupportedMessage } from '../lib/utils'
import NftGallery from './NftGallery'
import CollectionInfo from './CollectionInfo'
import Spinner from './Spinner'
import IconWallet from './IconWallet'

export default function Main () {
  const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
  const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS

  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [address, setAddress] = useState()

  const [loading, setLoading] = useState(false)
  const [loadingNfts, setLoadingNfts] = useState(false)
  const [loadingMyNfts, setLoadingMyNfts] = useState(false)

  const [currentChain, setCurrentChain] = useState()
  const [collectionInfo, setCollectionInfo] = useState(null)
  const [nfts] = useState([])
  const [filterByAddress, setFilterByAddress] = useState(false)

  const setupProvider = () => {
    const { ethereum } = window
    if (provider) return provider

    const newProvider = new ethers.providers.Web3Provider(ethereum)
    setProvider(newProvider)

    return newProvider
  }
  const setupContract = () => {
    if (contract) return contract

    const provider = setupProvider()
    const newContract = new ethers.Contract(NFT_ADDRESS, nftAbi, provider)
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

  async function connectWallet () {
    const { ethereum } = window
    if (!ethereum) {
      toast(metamaskNotSupportedMessage(), { type: 'error' })
      return
    }
    setLoading(true)

    setupProvider()
    setupContract()
    let currentChain = await setupCurrentChain()

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

    await ethereum.request({
      method: 'eth_requestAccounts'
    })

    setupAddress()

    try {
      await setupCollectionInfo()
    } catch (e) {
      console.error(e)
      toast('Provided NFT collection address is invalid! Please check NFT address and Chain ID.', { type: 'error' })
      setLoading(false)
      return
    }

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
      price: await contract.price(),
      royaltiesFees: await contract.royaltiesFees(),
      royaltiesAddress: await contract.royaltiesAddress()
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
          <CollectionInfo collection={collectionInfo} provider={provider} address={address} />
        )}

        <div className="btn-connect-wrapper">
          <button id="btnConnect" onClick={() => connectWallet()}>
            {loading
              ? (
              <Spinner />
                )
              : address
                ? (
              <span>
                <IconWallet /> {address.slice(0, 11)}
              </span>
                  )
                : (
                    'Connect wallet'
                  )}
          </button>
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
              return <NftGallery address={address} nfts={nfts} />
            }
          })()}
        </div>
      )}
    </div>
  )
}
