"use client";

import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import { ReadContractErrorType } from "viem";
import { Search } from "lucide-react";
import { useAccount } from "wagmi";

export function CampaignGrid() {
  const { campaigns, refetchCampaigns } = useCrowdfunding() as {
    campaigns: Array<{
      id: string;
      title: string;
      image_url: string;
      description: string;
      targetAmount: bigint;
      raisedAmount: bigint;
      completedAmount: bigint;
      deadline: bigint;
      isCompleted: boolean;
      owner: string;
    }>;
    refetchCampaigns: () => Promise<
      QueryObserverResult<unknown, ReadContractErrorType>
    >;
  };

  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("active");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
  }, [refetchCampaigns]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  // Calculate total active campaigns dynamically
  const totalActiveCampaigns = campaigns?.filter(
    (campaign) => !campaign.isCompleted
  ).length;

  const filteredCampaigns = campaigns?.filter((campaign) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const campaignTitle = campaign.title.toLowerCase();
    const campaignOwner = campaign.owner.toLowerCase();

    switch (filter) {
      case "active":
        if (campaign.isCompleted) return false;
        break;
      case "completed":
        if (!campaign.isCompleted) return false;
        break;
      case "myCampaigns":
        if (!address || campaignOwner !== address.toLowerCase()) return false;
        break;
    }

    if (searchTerm) {
      return (
        campaignTitle.includes(searchLower) ||
        campaignOwner.includes(searchLower)
      );
    }

    return true;
  });

  const getCampaignCount = () => {
    switch (filter) {
      case "active":
        return totalActiveCampaigns || 0;
      case "completed":
        return (campaigns?.length || 0) - (totalActiveCampaigns || 0);
      case "myCampaigns":
        return filteredCampaigns?.length || 0;
      default:
        return campaigns?.length || 0;
    }
  };

  const totalItems = searchTerm
    ? filteredCampaigns?.length
    : getCampaignCount();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns?.slice(startIndex, endIndex);

  const PaginationButton = ({
    page,
    current,
  }: {
    page: number;
    current: boolean;
  }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
        current
          ? "bg-purple-600 text-white"
          : "bg-white/50 hover:bg-white/70 text-purple-900"
      }`}
    >
      {page}
    </button>
  );

  const FilterButton = ({ label, value }: { label: string; value: string }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        filter === value
          ? "bg-purple-600 text-white"
          : "bg-white/50 hover:bg-white/70 text-purple-900"
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8">
          <p className="text-purple-900">
            Loading campaigns from the blockchain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Campaign Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/30 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-purple-900 font-semibold">Total Campaigns</h3>
          <p className="text-2xl text-purple-600">{campaigns?.length || 0}</p>
        </div>
        <div className="bg-white/30 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-purple-900 font-semibold">Active Campaigns</h3>
          <p className="text-2xl text-purple-600">
            {totalActiveCampaigns || 0}
          </p>
        </div>
      </div> */}

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search by title or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterButton label="All" value="all" />
          <FilterButton label="Active" value="active" />
          <FilterButton label="Completed" value="completed" />
          <FilterButton label="My Campaigns" value="myCampaigns" />
        </div>
      </div>

      {/* Campaigns Grid */}
      {!currentCampaigns || currentCampaigns.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8">
            <p className="text-purple-900">No campaigns found.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCampaigns.map((campaign) => (
              <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationButton
                  key={i + 1}
                  page={i + 1}
                  current={currentPage === i + 1}
                />
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
