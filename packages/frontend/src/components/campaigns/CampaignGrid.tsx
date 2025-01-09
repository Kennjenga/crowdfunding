"use client";

// components/campaigns/CampaignGrid.tsx
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";

export function CampaignGrid() {
  const { campaigns } = useCrowdfunding() as {
    campaigns: Array<{
      id: string;
      title: string;
      description: string;
      targetAmount: bigint;
      raisedAmount: bigint;
      deadline: bigint;
      isCompleted: boolean;
    }>;
  };

  if (!campaigns) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="text-center py-8">No campaigns found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
          <CampaignCard campaign={campaign} />
        </Link>
      ))}
    </div>
  );
}
