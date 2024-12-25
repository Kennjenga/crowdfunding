// app/page.tsx
"use client";

import { Profile } from "@/components/profile";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 gap-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-7xl px-4 py-4 flex justify-end">
        <ConnectButton
          showBalance={{
            smallScreen: true,
            largeScreen: true,
          }}
          chainStatus="icon"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
      <Profile />
    </div>
  );
}
