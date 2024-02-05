import { ethers } from 'ethers'
import nftAbi from './nftAbi'
import { toast } from 'react-toastify'

function browserName () {
  const userAgent = navigator.userAgent
  let browserName = ''

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'chrome'
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'firefox'
  } else if (userAgent.match(/safari/i)) {
    browserName = 'safari'
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'opera'
  } else if (userAgent.match(/edg/i)) {
    browserName = 'edge'
  } else if (userAgent.match(/brave/i)) {
    browserName = 'brave'
  } else {
    browserName = 'No browser detection'
  }
  return browserName
}
function browserSupportsMetaMask () {
  return ['chrome', 'firefox', 'brave', 'edge', 'opera'].includes(
    browserName()
  )
}
export const metamaskNotSupportedMessage = () => {
  return browserSupportsMetaMask()
    ? 'You need MetaMask extension to connect wallet!'
    : 'Your browser does not support MetaMask, please use another browser!'
}

export const addChain = async (chainId: string) => {
  const { ethereum } = window

  if (chainId === 0x507) {
    // moonbase
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://rpc.api.moonbase.moonbeam.network/'],
          chainName: 'Moonbase',
          nativeCurrency: {
            name: 'DEV',
            symbol: 'DEV',
            decimals: 18
          },
          blockExplorerUrls: ['https://moonbase.moonscan.io/']
        }
      ]
    })
  } else if (chainId === 0x504) {
    // moonbeam
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://rpc.api.moonbeam.network/'],
          chainName: 'Moonbeam',
          nativeCurrency: {
            name: 'GLMR',
            symbol: 'GLMR',
            decimals: 18
          },
          blockExplorerUrls: ['https://moonscan.io/']
        }
      ]
    })
  } else if (chainId === 0x250) {
    // moonbeam
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://evm.astar.network/'],
          chainName: 'Astar',
          nativeCurrency: {
            name: 'ASTR',
            symbol: 'ASTR',
            decimals: 18
          },
          blockExplorerUrls: ['https://blockscout.com/astar']
        }
      ]
    })
  } else {
    throw new Error('Wrong CHAIN_ID')
  }
}

export const getCurrentChain = async () => {
  const { ethereum } = window
  return await ethereum.request({ method: 'eth_chainId' })
}
export const switchChain = async (chainId: string) => {
  const { ethereum } = window
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }] // chainId must be in HEX with 0x in front
  })
}

export function checkInputAddress (address: string) {
  if (!address) {
    toast('Enter contract address!', { type: 'warning' })
    return false
  }
  return true
}
export function checkInputAmount (amount: number) {
  if (amount && Number(amount) > 0 && Number(amount) <= 5) {
    return true
  }
  toast('Enter valid amount (number from 1 to 5)!', { type: 'warning' })
  return false
}
export function checkInputToken (token: string) {
  if (token && Number(token) >= 0) {
    return true
  }
  toast('Enter token ID!', { type: 'warning' })
  return false
}

export const getProvider = () => {
  const { ethereum } = window
  return new ethers.providers.Web3Provider(ethereum)
}

export const getContract = (contractAddress?: string) => {
  const NFT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
  return new ethers.Contract(contractAddress || NFT_ADDRESS, nftAbi, getProvider())
}

export async function isTokenNestable (contract: Contract) {
  try {
    return await contract.supportsInterface('0x42b0e56f')
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function getMyNftIDs (contract: Contract, walletAddress: string) {
  const nftIDs = []
  try {
    const balance = await contract.balanceOf(walletAddress)

    for (let i = 0; i < balance.toBigInt(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i)
      nftIDs.push(tokenId.toNumber())
    }
  } catch (error) {
    console.log(error)
  }
  return nftIDs
}
