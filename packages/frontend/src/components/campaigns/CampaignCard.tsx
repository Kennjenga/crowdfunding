// components/campaigns/CampaignCard.tsx
import { formatEther } from "ethers";

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    targetAmount: bigint;
    raisedAmount: bigint;
    deadline: bigint;
    isCompleted: boolean;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer bg-white">
      <h2 className="text-xl font-bold mb-2">{campaign.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Target:</span>
          <span className="font-medium">
            {formatEther(campaign.targetAmount)} ETH
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Raised:</span>
          <span className="font-medium">
            {formatEther(campaign.raisedAmount)} ETH
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Deadline:</span>
          <span className="font-medium">
            {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2">
          <span
            className={`inline-block px-2 py-1 rounded text-sm ${
              campaign.isCompleted
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {campaign.isCompleted ? "Completed" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
