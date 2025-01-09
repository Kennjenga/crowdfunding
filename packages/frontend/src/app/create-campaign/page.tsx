// app/create-campaign/page.tsx
"use client";

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
