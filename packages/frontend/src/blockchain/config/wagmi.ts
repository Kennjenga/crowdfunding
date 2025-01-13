import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum, base, optimism } from 'wagmi/chains';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";



if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

const { wallets } = getDefaultWallets();


export const config = getDefaultConfig({
  appName: 'Pamoja app',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    mainnet,
    sepolia,
    polygon,
    arbitrum,
    base,
    optimism,
  ],
  ssr: true,
});
