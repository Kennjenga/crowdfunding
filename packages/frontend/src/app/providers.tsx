// app/providers.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/blockchain/config/wagmi";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;

  initialState?: State;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#F0B90B",
            accentColorForeground: "#1E2026",
            borderRadius: "medium",
            fontStack: "system",
          })}
          // modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
