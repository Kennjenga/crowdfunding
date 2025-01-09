// app/page.tsx
"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Profile } from "@/components/profile";
import Link from "next/link";
import { CampaignGrid } from "@/components/campaigns/CampaignGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Crowdfunding Platform</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/create-campaign"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              Create Campaign
            </Link>
            <Link
              href="/grant-creator"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
            >
              Manage Creators
            </Link>
            <ConnectButton />
          </div>
        </nav>
        <Profile />
        <CampaignGrid />
      </div>
    </div>
  );
}

// components/campaigns/CampaignGrid.tsx
("use client");
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { CampaignCard } from "./CampaignCard";
import Link from "next/link";
import { formatEther } from "ethers";

export function CampaignGrid() {
  const { campaigns } = useCrowdfunding();

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

// app/campaign/[id]/page.tsx
("use client");
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "ethers";
import {
  useCrowdfunding,
  useGetCampaign,
} from "@/blockchain/hooks/useCrowdfunding";

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const campaignId = BigInt(params.id as string);

  const { data: campaign } = useGetCampaign(campaignId);
  const { isAdmin, donateToCampaign, withdrawFunds, deleteCampaign } =
    useCrowdfunding();

  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!campaign) {
    return <div className="text-center py-8">Loading campaign details...</div>;
  }

  const isOwner = address === campaign.owner;
  const canManage = isOwner || isAdmin;
  const canWithdraw =
    isOwner && campaign.isCompleted && !campaign.fundsWithdrawn;

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
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Campaigns
        </button>
        <ConnectButton />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
        <p className="text-gray-600 mb-6">{campaign.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Target Amount</p>
            <p className="text-xl font-bold">
              {formatEther(campaign.targetAmount)} ETH
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Raised Amount</p>
            <p className="text-xl font-bold">
              {formatEther(campaign.raisedAmount)} ETH
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Deadline</p>
            <p className="text-xl font-bold">
              {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Status</p>
            <p
              className={`text-xl font-bold ${
                campaign.isCompleted ? "text-green-600" : "text-blue-600"
              }`}
            >
              {campaign.isCompleted ? "Completed" : "Active"}
            </p>
          </div>
        </div>

        {!campaign.isCompleted && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (ETH)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="0.0"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleDonate}
                disabled={isLoading || !donationAmount}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Donate"}
              </button>
            </div>
          </div>
        )}

        {canWithdraw && (
          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
          >
            {isLoading ? "Processing..." : "Withdraw Funds"}
          </button>
        )}

        {canManage && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Delete Campaign"}
          </button>
        )}
      </div>
    </div>
  );
}

// app/create-campaign/page.tsx
("use client");
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther } from "ethers";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";

export default function CreateCampaign() {
  const router = useRouter();
  const { createCampaign } = useCrowdfunding();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createCampaign(
        formData.title,
        formData.description,
        parseEther(formData.targetAmount),
        Number(formData.duration)
      );
      router.push("/");
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Campaigns
        </button>
        <ConnectButton />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (ETH)
            </label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

// app/grant-creator/page.tsx (continued)
("use client");
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { isAddress } from "ethers";

export default function GrantCreator() {
  const router = useRouter();
  const { grantCampaignCreatorRole, isAdmin } = useCrowdfunding();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAddress(address)) {
      setError("Invalid Ethereum address");
      return;
    }

    try {
      setIsLoading(true);
      await grantCampaignCreatorRole(address);
      setAddress("");
      alert("Creator role granted successfully!");
    } catch (error) {
      console.error("Error granting creator role:", error);
      setError(
        "Failed to grant creator role. Make sure you have admin permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Campaigns
          </button>
          <ConnectButton />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-red-600">
            You must be an admin to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Campaigns
        </button>
        <ConnectButton />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Grant Campaign Creator Role</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0x..."
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Grant Creator Role"}
          </button>
        </form>
      </div>
    </div>
  );
}

// components/shared/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// components/shared/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

// layout.tsx
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

// components/layout/Navbar.tsx
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useCrowdfunding();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-gray-600 transition"
          >
            Crowdfunding Platform
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Campaigns
            </Link>
            <Link
              href="/create-campaign"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/create-campaign"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create Campaign
            </Link>
            {isAdmin && (
              <Link
                href="/grant-creator"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/grant-creator"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Manage Creators
              </Link>
            )}
          </div>

          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
