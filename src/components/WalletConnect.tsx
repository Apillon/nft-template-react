import { useState } from 'react'
import Btn from './Btn'
import IconWallet from './IconWallet'
import { shortHash } from '../lib/strings'
import { useWeb3Context } from '../context/Web3Context'

interface WalletConnectProps {
  connect: () => void
}

export default function WalletConnect({ connect }: WalletConnectProps) {
  const { state, disconnect } = useWeb3Context()

  const [loading, setLoading] = useState<boolean>(false)

  const connectWallet = async () => {
    setLoading(true)
    await connect()
    setLoading(false)
  }

  return (
    <>
      {state.walletAddress ? (
        <Btn loading={loading} disabled={false} onClick={() => disconnect()}>
          <span className="address">
            <IconWallet />
            {shortHash(state.walletAddress)}
          </span>
          {/* <small>(disconnect)</small> */}
        </Btn>
      ) : (
        <Btn loading={loading} disabled={false} onClick={() => connectWallet()} type="button">
          Connect wallet
        </Btn>
      )}
    </>
  )
}
