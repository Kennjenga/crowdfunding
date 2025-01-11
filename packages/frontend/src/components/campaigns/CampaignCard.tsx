// components/campaigns/CampaignCard.tsx
import { formatEther } from "ethers";
import { useEnsName, useEnsAvatar } from "wagmi";
import Image from "next/image";

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    targetAmount: bigint;
    raisedAmount: bigint;
    deadline: bigint;
    isCompleted: boolean;
    owner: string;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { data: ensName } = useEnsName({
    address: campaign.owner as `0x${string}`,
  });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || "" });

  const progress =
    (Number(campaign.raisedAmount) / Number(campaign.targetAmount)) * 100;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          {ensAvatar ? (
            <Image
              src={ensAvatar}
              alt={ensName || campaign.owner}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-orange-400" />
          )}
          <div>
            <h2 className="text-xl font-bold text-purple-900 line-clamp-1">
              {campaign.title}
            </h2>
            <p className="text-sm text-purple-700">
              by{" "}
              {ensName ||
                `${campaign.owner.slice(0, 6)}...${campaign.owner.slice(-4)}`}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <div className="progress-bar-glass">
          <div
            className="progress-bar-fill-glass"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-purple-700">
            {formatEther(campaign.raisedAmount)} ETH raised
          </span>
          <span className="text-purple-900 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Target</span>
            <span className="font-medium text-purple-900">
              {formatEther(campaign.targetAmount)} ETH
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">Ends</span>
            <span className="font-medium text-purple-900">
              {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium
              ${
                campaign.isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-800"
              }`}
          >
            {campaign.isCompleted ? "Completed" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
