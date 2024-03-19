import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Btn from './Btn'
import IconWallet from './IconWallet'
import { shortHash } from '../lib/strings'
import { metamaskNotSupportedMessage } from '../lib/utils'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const connector = connectors.find((item) => item.type === 'metaMask')

  return (
    <>
      {(() => {
        if (isConnected && address) {
          return (
            <Btn loading={isPending} disabled={false} onClick={() => disconnect()}>
              <span className="address">
                <IconWallet />
                {shortHash(address)}
              </span>
              {/* <small>(disconnect)</small> */}
            </Btn>
          )
        } else if (connector) {
          return (
            <Btn
              key={connector.uid}
              loading={isPending}
              disabled={false}
              onClick={() => connect({ connector })}
              type="button"
            >
              Connect wallet
            </Btn>
          )
        } else {
          return <span className="error">{metamaskNotSupportedMessage()}</span>
        }
      })()}
    </>
  )
}
