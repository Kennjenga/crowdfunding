"use client";

import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ReadContractErrorType } from "viem";

export function UrgentCampaign() {
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
  const [urgentCampaigns, setUrgentCampaigns] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      targetAmount: bigint;
      raisedAmount: bigint;
      deadline: bigint;
      isCompleted: boolean;
      owner: string;
    }>
  >([]);

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

  // Find the most urgent campaigns
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds (UNIX timestamp)
      const sortedCampaigns = campaigns
        .filter((campaign) => campaign.deadline > now) // Only include active campaigns
        .sort((a, b) => Number(a.deadline) - Number(b.deadline)) // Sort by closest deadline
        .slice(0, 4); // Limit to the top 4 urgent campaigns

      setUrgentCampaigns(sortedCampaigns);
    }
  }, [campaigns]);

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
    <div className="p-4">
      {/* Urgent Campaign Section */}
      {urgentCampaigns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            Urgent Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {urgentCampaigns.map((campaign) => (
              <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
