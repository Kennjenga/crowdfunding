"use client";

import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ReadContractErrorType } from "viem";

export function CampaignGrid() {
  const { campaigns, refetchCampaigns } = useCrowdfunding() as {
    campaigns: Array<{
      id: string;
      title: string;
      description: string;
      targetAmount: bigint;
      raisedAmount: bigint;
      deadline: bigint;
      isCompleted: boolean;
      owner: string;
    }>;
    refetchCampaigns: () => Promise<
      QueryObserverResult<unknown, ReadContractErrorType>
    >;
  };

  const [loading, setLoading] = useState(true);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        await refetchCampaigns(); // Fetch campaigns from the blockchain
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [refetchCampaigns]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="glass-card p-8">
          <p className="text-purple-900">
            Loading campaigns from the blockchain...
          </p>
        </div>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="glass-card p-8">
          <p className="text-purple-900">No campaigns found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {campaigns.map((campaign) => (
        <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
          <CampaignCard campaign={campaign} />
        </Link>
      ))}
    </div>
  );
}
