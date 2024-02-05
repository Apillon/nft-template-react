import { http, createConfig } from 'wagmi'
import { moonbaseAlpha, moonbeam, astar } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [moonbaseAlpha, moonbeam, astar ],
  connectors: [
    metaMask(),
  ],
  transports: {
    [moonbaseAlpha.id]: http(),
    [moonbeam.id]: http(),
    [astar.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
