import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [
      mainnet,
      sepolia,
      polygon,
      arbitrum,
      base,
      optimism,
    ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
  
})