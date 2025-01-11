import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum, base, optimism} from 'wagmi/chains';
import { http } from 'wagmi';



if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

export const config = getDefaultConfig({
  appName: 'Pamoja app',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [
    mainnet,
    sepolia,
    polygon,
    arbitrum,
    base,
    optimism,
  ],
  transports: {
    [sepolia.id]: http(),
  },
});