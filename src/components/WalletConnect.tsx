import { useState } from 'react'
import Btn from './Btn'
import IconWallet from './IconWallet'
import { shortHash } from '../lib/strings'
import useWeb3Provider from '../hooks/useWeb3Provider'

interface WalletConnectProps {
  connect: () => void
}

export default function WalletConnect({ connect }: WalletConnectProps) {
  const { state, disconnect } = useWeb3Provider()

  const [loading, setLoading] = useState<boolean>(false)

  const connectWallet = async () => {
    setLoading(true)

    await connect()
    console.log(state)

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
