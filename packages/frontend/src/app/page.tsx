// app/page.tsx
"use client";
// app/page.tsx
import { useState } from "react";
import { Profile } from "@/components/profile";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import CampaignDetails from "../components/CampaignDetails";
import CreateCampaign from "../components/CreateCampaignForm";
import { formatUnits } from "ethers";

export default function Home() {
  const { campaigns } = useCrowdfunding() as {
    campaigns: Array<{
      id: string;
      title: string;
      description: string;
      targetAmount: number;
      raisedAmount: number;
      deadline: number;
      isCompleted: boolean;
      owner: string;
      fundsWithdrawn: boolean;
    }>;
  };
  const [selectedCampaign, setSelectedCampaign] = useState<{
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    raisedAmount: number;
    deadline: number;
    isCompleted: boolean;
    owner: string;
    fundsWithdrawn: boolean;
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const weiToETH = (wei: bigint | string | number) => {
    // console.log("Input Wei:", wei.toString());
    const eth = formatUnits(wei.toString(), 18);
    // console.log("Converted ETH:", eth);
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(Number(eth));
    // console.log("Formatted ETH:", formatted);
    return formatted;
  };

  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 gap-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Crowdfunding Campaigns</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {showCreateForm ? "View Campaigns" : "Create Campaign"}
            </button>
            <ConnectButton />
          </div>
        </div>
        <Profile />

        {showCreateForm ? (
          <CreateCampaign />
        ) : selectedCampaign ? (
          <CampaignDetails
            campaign={selectedCampaign}
            onBack={() => setSelectedCampaign(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns?.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="border p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">{campaign.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="space-y-1">
                  <p>Target: {weiToETH(campaign.targetAmount)} ETH</p>
                  <p>Raised: {weiToETH(campaign.raisedAmount)} ETH</p>
                  <p>
                    Deadline:{" "}
                    {new Date(
                      Number(campaign.deadline) * 1000
                    ).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm ${
                      campaign.isCompleted ? "text-green-500" : "text-blue-500"
                    }`}
                  >
                    {campaign.isCompleted ? "Completed" : "Active"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
