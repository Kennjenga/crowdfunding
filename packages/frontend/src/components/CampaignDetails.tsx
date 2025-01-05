// components/CampaignDetails.tsx
import { useState } from "react";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { parseEther } from "viem";

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  owner: string;
  isCompleted: boolean;
  fundsWithdrawn: boolean;
}

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
}

export default function CampaignDetails({
  campaign,
  onBack,
}: CampaignDetailsProps) {
  const {
    donateToCampaign,
    withdrawFunds,
    deleteCampaign,
    isAdmin,
    userAddress,
    refetchCampaigns,
  } = useCrowdfunding();
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    if (!donationAmount) return;
    setIsLoading(true);
    try {
      await donateToCampaign(Number(campaign.id), parseEther(donationAmount));
      await refetchCampaigns();
      setDonationAmount("");
    } catch (error) {
      console.error("Error donating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      await withdrawFunds(Number(campaign.id));
      await refetchCampaigns();
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCampaign(Number(campaign.id));
      await refetchCampaigns();
      onBack();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = userAddress?.toLowerCase() === campaign.owner.toLowerCase();
  const canDelete = isAdmin || isOwner;

  return (
    <div className="border p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{campaign.title}</h1>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          ← Back
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">{campaign.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Target Amount</p>
            <p className="text-lg font-semibold">
              {campaign.targetAmount.toString()} ETH
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Raised Amount</p>
            <p className="text-lg font-semibold">
              {campaign.raisedAmount.toString()} ETH
            </p>
          </div>
        </div>

        {!campaign.isCompleted && (
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="flex-1 border rounded p-2"
              disabled={isLoading}
            />
            <button
              onClick={handleDonate}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Donate"}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {isOwner && !campaign.fundsWithdrawn && campaign.isCompleted && (
            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Withdraw Funds"}
            </button>
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Delete Campaign"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
