// components/CreateCampaign.tsx
import { useState } from "react";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { parseEther } from "viem";

export default function CreateCampaign() {
  const { createCampaign, refetchCampaigns } = useCrowdfunding();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign(
        formData.title,
        formData.description,
        Number(parseEther(formData.targetAmount)),
        Number(formData.duration)
      );
      await refetchCampaigns();
      setFormData({
        title: "",
        description: "",
        targetAmount: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Amount (ETH)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.targetAmount}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, targetAmount: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (days)
        </label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, duration: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Campaign
      </button>
    </form>
  );
}
