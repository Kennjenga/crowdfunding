// config/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia, liskSepolia } from 'wagmi/chains'
import { http } from 'wagmi';

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

export const config = getDefaultConfig({
  appName: 'Crowdfunding app',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [mainnet, sepolia, liskSepolia],
  transports: {
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})