"use client";

import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ReadContractErrorType } from "viem";
import { Campaign } from "@/types/crowdfunding";

export function UrgentCampaign() {
  const { campaigns, refetchCampaigns } = useCrowdfunding() as {
    campaigns: Campaign[];
    refetchCampaigns: () => Promise<
      QueryObserverResult<unknown, ReadContractErrorType>
    >;
  };

  const [loading, setLoading] = useState(true);
  const [urgentCampaigns, setUrgentCampaigns] = useState<Campaign[]>([]);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );

  // Update current timestamp every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  // Fetch campaigns on component mount and periodically
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        await refetchCampaigns();
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();

    // Refetch campaigns every 5 minutes
    const intervalId = setInterval(fetchCampaigns, 300000);

    return () => clearInterval(intervalId);
  }, [refetchCampaigns]);

  // Update urgent campaigns when either campaigns or current timestamp changes
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const filterAndSortCampaigns = () => {
        const activeCampaigns = campaigns
          .filter(
            (campaign) =>
              Number(campaign.deadline) > currentTimestamp && // Use currentTimestamp instead of now
              !campaign.isCompleted &&
              !campaign.fundsWithdrawn &&
              Number(campaign.raisedAmount) < Number(campaign.targetAmount)
          )
          .sort((a, b) => {
            // Calculate remaining time for each campaign
            const timeLeftA = Number(a.deadline) - currentTimestamp;
            const timeLeftB = Number(b.deadline) - currentTimestamp;

            // Sort by time remaining and progress ratio
            const progressA = Number(a.raisedAmount) / Number(a.targetAmount);
            const progressB = Number(b.raisedAmount) / Number(b.targetAmount);

            // Prioritize campaigns closer to deadline with higher progress
            return timeLeftA - timeLeftB || progressB - progressA;
          })
          .slice(0, 4);

        setUrgentCampaigns(activeCampaigns);
      };

      filterAndSortCampaigns();
    }
  }, [campaigns, currentTimestamp]); // Depend on both campaigns and currentTimestamp

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
