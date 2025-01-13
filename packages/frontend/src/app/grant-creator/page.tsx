"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { isAddress } from "ethers";

export default function GrantCreator() {
  const router = useRouter();
  const { grantCampaignCreatorRole, revokeCampaignCreatorRole, isAdmin } =
    useCrowdfunding();
  const [grantAddress, setGrantAddress] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");
  const [isLoadingGrant, setIsLoadingGrant] = useState(false);
  const [isLoadingRevoke, setIsLoadingRevoke] = useState(false);
  const [grantError, setGrantError] = useState("");
  const [revokeError, setRevokeError] = useState("");

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantError("");

    if (!isAddress(grantAddress)) {
      setGrantError("Invalid Ethereum address");
      return;
    }

    try {
      setIsLoadingGrant(true);
      await grantCampaignCreatorRole(grantAddress as `0x${string}`);
      setGrantAddress("");
      alert("Creator role granted successfully!");
    } catch (error) {
      console.error("Error granting creator role:", error);
      setGrantError(
        "Failed to grant creator role. Make sure you have admin permissions."
      );
    } finally {
      setIsLoadingGrant(false);
    }
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevokeError("");

    if (!isAddress(revokeAddress)) {
      setRevokeError("Invalid Ethereum address");
      return;
    }

    try {
      setIsLoadingRevoke(true);
      await revokeCampaignCreatorRole(revokeAddress as `0x${string}`);
      setRevokeAddress("");
      alert("Creator role revoked successfully!");
    } catch (error) {
      console.error("Error revoking creator role:", error);
      setRevokeError(
        "Failed to revoke creator role. Make sure you have admin permissions."
      );
    } finally {
      setIsLoadingRevoke(false);
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

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">Grant Campaign Creator Role</h1>

        <form onSubmit={handleGrantSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              value={grantAddress}
              onChange={(e) => setGrantAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0x..."
              required
            />
          </div>

          {grantError && (
            <div className="text-red-600 text-sm">{grantError}</div>
          )}

          <button
            type="submit"
            disabled={isLoadingGrant}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoadingGrant ? "Processing..." : "Grant Creator Role"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">
          Revoke Campaign Creator Role
        </h1>

        <form onSubmit={handleRevokeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0x..."
              required
            />
          </div>

          {revokeError && (
            <div className="text-red-600 text-sm">{revokeError}</div>
          )}

          <button
            type="submit"
            disabled={isLoadingRevoke}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isLoadingRevoke ? "Processing..." : "Revoke Creator Role"}
          </button>
        </form>
      </div>
    </div>
  );
}
