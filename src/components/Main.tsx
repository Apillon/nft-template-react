import { useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import { useWeb3Context } from '../context/Web3Context'
import Btn from './Btn'
import NftGallery from './Nft/NftGallery'
import CollectionInfo from './CollectionInfo'
import WalletConnect from './WalletConnect'
import {
  addChain,
  changeChain,
  getCurrentChain,
  initProvider,
  isCollectionNestable,
  metamaskNotSupportedMessage
} from '../lib/utils'
import { CHAIN_ID, CONTRACT_ADDRESS } from '../lib/config'

export default function Main() {
  const { state, setState, filterNfts, initContract, getCollectionInfo, getMyNftIDs, getNfts } = useWeb3Context()

  const connectWallet = async () => {
    if (state.isAuthenticated) return

    try {
      const { ethereum } = window

      if (!ethereum) {
        toast(metamaskNotSupportedMessage(), { type: 'error' })
        return
      }
      let provider = initProvider()
      let contract = initContract(CONTRACT_ADDRESS, provider)

      const accounts: string[] = await provider.send('eth_requestAccounts', [])

      if (accounts.length > 0) {
        let currentChain = await getCurrentChain()
        if (currentChain !== CHAIN_ID) {
          try {
            await changeChain(CHAIN_ID)

            provider = new ethers.providers.Web3Provider(ethereum)
            contract = initContract(CONTRACT_ADDRESS, provider)
            currentChain = await getCurrentChain()
          } catch (e) {
            toast('Error connecting to metamask', { type: 'error' })

            try {
              await addChain(CHAIN_ID)
            } catch (e) {
              toast('' + e, { type: 'error' })
            }
          }
        }
        const contracts = state.contracts
        contracts[CONTRACT_ADDRESS] = contract

        state.provider = provider
        setState({ ...state, provider })

        state.currentChain = currentChain
        setState({ ...state, currentChain })

        state.signer = provider.getSigner()
        state.walletAddress = await state.signer.getAddress()
        state.isNestable = await isCollectionNestable(contract)

        state.isAuthenticated = true
        setState({ ...state, isAuthenticated: true })
        localStorage.setItem('isAuthenticated', 'true')

        const collectionInfo = await getCollectionInfo(contract)
        setState({ ...state, collectionInfo })

        const myNftIDs = await getMyNftIDs()
        setState({ ...state, myNftIDs })

        const nfts = await getNfts()
        setState({ ...state, nfts })
      }
    } catch (e) {
      console.debug(e)
    }
  }

  useEffect(() => {
    setState(state)
  }, [state.collectionInfo?.totalSupply])
  useEffect(() => {
    setState(state)
  }, [state.nfts])
  useEffect(() => {
    setState(state)
  }, [state])

  return (
    <div>
      <div className="box collection br text-center">
        {/* Collection loaded */}
        <CollectionInfo nftId={0} />

        <div className="btn-connect-wrapper">
          <WalletConnect connect={connectWallet} />
        </div>
      </div>

      {/* Wallet connected */}
      {state.collectionInfo?.name && state.isNestable && (
        <div id="nestableInfo" className="max-w-lg mx-auto my-12">
          <h3>
            The collection you are viewing supports nesting NFTs you own. To setup the nested relationship between NFTs,
            you first have to own them.
          </h3>
          <strong>Instructions:</strong>
          <ol>
            <li>Mint one or multiple NFTs</li>
            <li>Once minted, click on “My NFTs”</li>
            <li>The NFTs you own will be displayed</li>
            <li>Click on the NFT you want to set as a parent</li>
            <li>A window will open, allowing you to link child NFTs to that NFT</li>
          </ol>
        </div>
      )}

      {/* Wallet connected */}
      {state.walletAddress && state.collectionInfo?.name && (
        <div id="actions relative">
          <h2 className="text-center">Show NFTs:</h2>
          <div className="actions relative">
            <Btn
              loading={state.loadingNfts && !state.filterByWallet}
              disabled={false}
              onClick={() => filterNfts(false)}
            >
              All nfts
            </Btn>
            <Btn loading={state.loadingNfts && state.filterByWallet} disabled={false} onClick={() => filterNfts(true)}>
              My nfts
            </Btn>
          </div>
        </div>
      )}

      {/* Collection loaded */}
      {state.collectionInfo?.address && (
        <div>
          {(() => {
            if (Number(state.collectionInfo.totalSupply) === 0) {
              return <h2 className="text-center">No NFTs, they must be minted first.</h2>
            } else if (state.filterByWallet && !state.nfts) {
              return <h2 className="text-center">You don`t have any NFTs</h2>
            } else if (!state.nfts) {
              return <h2 className="text-center">No NFTs, they must be minted first.</h2>
            } else {
              return <NftGallery />
            }
          })()}
        </div>
      )}
    </div>
  )
}
