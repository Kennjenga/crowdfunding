// app/grant-creator/page.tsx (continued)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { isAddress } from "ethers";

export default function GrantCreator() {
  const router = useRouter();
  const { grantCampaignCreatorRole, isAdmin } = useCrowdfunding();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAddress(address)) {
      setError("Invalid Ethereum address");
      return;
    }

    try {
      setIsLoading(true);
      await grantCampaignCreatorRole(address as `0x${string}`);
      setAddress("");
      alert("Creator role granted successfully!");
    } catch (error) {
      console.error("Error granting creator role:", error);
      setError(
        "Failed to grant creator role. Make sure you have admin permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Campaigns
          </button>
          <ConnectButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-red-600">
            You must be an admin to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Campaigns
        </button>
        <ConnectButton />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Grant Campaign Creator Role</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0x..."
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Grant Creator Role"}
          </button>
        </form>
      </div>
    </div>
  );
}
