"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "ethers";
import {
  useCrowdfunding,
  useGetCampaign,
} from "@/blockchain/hooks/useCrowdfunding";
import { Campaign } from "@/types/crowdfunding";
import Navbar from "@/components/navbar";

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const campaignId = BigInt(params.id as string);

  const { data } = useGetCampaign(campaignId);
  const campaign = data as Campaign;
  const { isAdmin, donateToCampaign, withdrawFunds, deleteCampaign } =
    useCrowdfunding();

  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!campaign) {
    return <div className="text-center py-8">Loading campaign details...</div>;
  }

  const isOwner = address === campaign.owner;
  const canManage: boolean = Boolean(isOwner || isAdmin);
  const canWithdraw: boolean = Boolean(
    isOwner && campaign.isCompleted && !campaign.fundsWithdrawn
  );

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      await donateToCampaign(campaignId, parseEther(donationAmount));
      setDonationAmount("");
    } catch (error) {
      console.error("Error donating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      await withdrawFunds(campaignId);
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        setIsLoading(true);
        await deleteCampaign(campaignId);
        router.push("/");
      } catch (error) {
        console.error("Error deleting:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            {campaign.title}
          </h1>
          <p className="text-gray-600 mb-4 md:mb-6">{campaign.description}</p>

          {/* Campaign Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Target Amount</p>
              <p className="text-lg md:text-xl font-bold">
                {formatEther(campaign.targetAmount)} ETH
              </p>
            </div>
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Raised Amount</p>
              <p className="text-lg md:text-xl font-bold">
                {formatEther(campaign.raisedAmount)} ETH
              </p>
            </div>
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Deadline</p>
              <p className="text-lg md:text-xl font-bold">
                {new Date(
                  Number(campaign.deadline) * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Status</p>
              <p
                className={`text-lg md:text-xl font-bold ${
                  campaign.isCompleted ? "text-green-600" : "text-blue-600"
                }`}
              >
                {campaign.isCompleted ? "Completed" : "Active"}
              </p>
            </div>
          </div>

          {/* Donation Form */}
          {!campaign.isCompleted && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (ETH)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="0.0"
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={handleDonate}
                  disabled={isLoading || !donationAmount}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Processing..." : "Donate"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {canWithdraw && (
              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Processing..." : "Withdraw Funds"}
              </button>
            )}

            {canManage && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Processing..." : "Delete Campaign"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
