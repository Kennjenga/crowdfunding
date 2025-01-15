"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "ethers";
import {
  useCrowdfunding,
  useGetCampaign,
  useGetCampaignDonations,
} from "@/blockchain/hooks/useCrowdfunding";
import { Campaign } from "@/types/crowdfunding";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const campaignId = BigInt(params.id as string);

  const { data } = useGetCampaign(campaignId);
  const donationsObjectData = useGetCampaignDonations(campaignId); // Fetch donations
  const donationsData = donationsObjectData.data as Array<{
    donor: string;
    amount: string;
  }>;
  // console.log(donationsData);
  const campaign = data as Campaign;
  const { isAdmin, donateToCampaign, withdrawFunds, deleteCampaign } =
    useCrowdfunding();

  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse text-purple-600 text-xl">
          Loading campaign details...
        </div>
      </div>
    );
  }

  const isOwner = address === campaign.owner;
  const canManage: boolean = Boolean(isOwner || isAdmin);
  const canWithdraw: boolean = Boolean(
    isOwner && campaign.targetReached && !campaign.fundsWithdrawn
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

  // console.log(campaign);
  const progress =
    (Number(
      (campaign.isCompleted || campaign.targetReached) &&
        campaign.fundsWithdrawn
        ? campaign.completedAmount
        : campaign.raisedAmount
    ) /
      Number(campaign.targetAmount)) *
    100;

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
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src={campaign.image_url}
              alt={campaign.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {campaign.title}
              </h1>
              <p className="text-white/90 text-lg">
                by {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">
                About this Campaign
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Latest Donations */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">
                Latest Donations
              </h2>
              {donationsData && donationsData.length > 0 ? (
                <div className="space-y-4">
                  {donationsData
                    .slice(-5)
                    .reverse()
                    .map((donation, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {donation.donor.slice(2, 4)}
                            </span>
                          </div>
                          <span className="text-purple-900">
                            {donation.donor.slice(0, 6)}...
                            {donation.donor.slice(-4)}
                          </span>
                        </div>
                        <span className="text-purple-600 font-bold">
                          {formatEther(donation.amount)} ETH
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No donations yet. Be the first to contribute!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Campaign Stats */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 mb-1">Progress</span>
                    <span className="text-purple-900 font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Raised</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {(campaign.targetReached || campaign.isCompleted) &&
                      campaign.fundsWithdrawn
                        ? formatEther(campaign.completedAmount)
                        : formatEther(campaign.raisedAmount)}
                      ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatEther(campaign.targetAmount)} ETH
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="text-xl font-semibold text-purple-900">
                    {new Date(
                      Number(campaign.deadline) * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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

            {/* Donation Form */}
            {(!campaign.isCompleted ||
              new Date() < new Date(Number(campaign.deadline) * 1000)) &&
              !campaign.fundsWithdrawn && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-900">
                    Make a Donation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (ETH)
                      </label>
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button
                      onClick={handleDonate}
                      disabled={isLoading || !donationAmount}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Processing..." : "Donate Now"}
                    </button>
                  </div>
                </div>
              )}

            {/* Admin Actions */}
            {(canWithdraw || canManage) && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-900">
                  Campaign Management
                </h3>
                <div className="space-y-3">
                  {canWithdraw && (
                    <button
                      onClick={handleWithdraw}
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Processing..." : "Withdraw Funds"}
                    </button>
                  )}
                  {canManage && (
                    <div>
                      <button
                        onClick={handleDelete}
                        disabled={
                          isLoading ||
                          campaign.isCompleted ||
                          campaign.fundsWithdrawn ||
                          Number(formatEther(campaign.raisedAmount)) > 0
                        }
                        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {isLoading
                          ? "Processing..."
                          : campaign.isCompleted
                          ? "Cannot Delete Completed Campaign"
                          : Number(formatEther(campaign.raisedAmount)) > 0
                          ? "Cannot Delete Campaign with Donations"
                          : "Delete Campaign"}
                      </button>
                      {(campaign.isCompleted ||
                        campaign.fundsWithdrawn ||
                        Number(formatEther(campaign.raisedAmount)) > 0) && (
                        <p className="text-sm text-red-500 mt-2 text-center">
                          {campaign.isCompleted
                            ? "Completed campaigns cannot be deleted"
                            : "Campaigns with donations or donations withdrawn cannot be deleted"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
