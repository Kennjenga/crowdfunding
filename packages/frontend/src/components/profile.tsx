// components/Profile.tsx
"use client";

import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { sepolia } from "wagmi/chains";

export function Profile() {
  const { address, isConnected } = useAccount();
  const { data: ensNameData, isLoading: ensLoading } = useEnsName({
    address,
    chainId: sepolia.id, // Use Sepolia chain ID
  });
  const ensName = ensNameData ?? undefined;
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: sepolia.id, // Use Sepolia chain ID
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isConnected || !address) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3">
        {ensLoading ? (
          <div className="animate-pulse flex space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex flex-col space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ) : ensName ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <ENSAvatar ensAvatar={ensAvatar} ensName={ensName} size={40} />
              </div>
              ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {ensName.slice(0, 2).toUpperCase()}
              </div>
              )
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                {ensName}
              </span>
              <span className="text-sm text-gray-500">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <span className="text-sm text-gray-500">
                No ENS name found on Sepolia
              </span>
            </div>
          </>
        )}
      </div>

      {/* Add a helper message for Sepolia */}
      <div className="text-sm text-gray-500 mt-2">
        To get an ENS name on Sepolia:
        <ol className="list-decimal list-inside mt-1">
          <li>Visit the Sepolia ENS app</li>
          <li>Connect your wallet</li>
          <li>Register a .eth name</li>
        </ol>
      </div>
    </div>
  );
}

interface ENSAvatarProps {
  ensAvatar: string | null | undefined;
  ensName: string;
  size?: number;
}

export function ENSAvatar({ ensAvatar, ensName, size = 40 }: ENSAvatarProps) {
  const [error, setError] = useState(false);

  if (!ensAvatar || error) {
    return (
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, borderRadius: "50%" }}
      >
        {ensName.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <Image
        src={ensAvatar}
        alt={ensName}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
