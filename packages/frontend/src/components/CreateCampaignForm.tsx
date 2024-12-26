import { useState } from "react";
import { useCrowdfunding } from "@/blockchain/hooks/useCrowdfunding";
import { formatEther } from "viem";

export function CrowdfundingUI() {
  const {
    totalCampaigns,
    useReadCampaign,
    useReadCampaignDonations,
    useCreateCampaign,
    useDonate,
    useWithdraw,
  } = useCrowdfunding();

  const [selectedCampaignId, setSelectedCampaignId] = useState<bigint>(
    BigInt(0)
  );
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: 30,
  });
  const [donationAmount, setDonationAmount] = useState("");

  // Get campaign details using the custom hooks
  const { data: campaign, isPending: isLoadingCampaign } =
    useReadCampaign(selectedCampaignId);
  const { data: donations, isPending: isLoadingDonations } =
    useReadCampaignDonations(selectedCampaignId);

  // Write function hooks
  const { createCampaign, isPending: isCreating } = useCreateCampaign();
  const { donate, isPending: isDonating } = useDonate();
  const { withdraw, isPending: isWithdrawing } = useWithdraw();

  const handleCreateCampaign = () => {
    createCampaign(
      newCampaign.title,
      newCampaign.description,
      newCampaign.targetAmount,
      newCampaign.duration
    );
  };

  const handleDonate = () => {
    donate(selectedCampaignId, donationAmount);
  };

  const handleWithdraw = () => {
    withdraw(selectedCampaignId);
  };

  return (
    <div className="p-4">
      {/* Total Campaigns */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Total Campaigns</h2>
        <p>{totalCampaigns?.toString() ?? "Loading..."} campaigns</p>
      </div>

      {/* Create Campaign Form */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Create Campaign</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Campaign Title"
            value={newCampaign.title}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, title: e.target.value })
            }
            className="border p-2 w-full"
          />
          <textarea
            placeholder="Campaign Description"
            value={newCampaign.description}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, description: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Target Amount (ETH)"
            value={newCampaign.targetAmount}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, targetAmount: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={newCampaign.duration}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                duration: parseInt(e.target.value),
              })
            }
            className="border p-2 w-full"
          />
          <button
            onClick={handleCreateCampaign}
            disabled={isCreating}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {isCreating ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Campaign Details</h2>
        <input
          type="number"
          placeholder="Campaign ID"
          onChange={(e) => setSelectedCampaignId(BigInt(e.target.value))}
          className="border p-2"
        />

        {isLoadingCampaign ? (
          <p>Loading campaign...</p>
        ) : campaign ? (
          <div className="mt-4">
            <h3 className="font-bold">{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Target: {formatEther(campaign.targetAmount)} ETH</p>
            <p>Raised: {formatEther(campaign.raisedAmount)} ETH</p>
            <p>Owner: {campaign.owner}</p>
            <p>
              Deadline:{" "}
              {new Date(Number(campaign.deadline) * 1000).toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>

      {/* Donations */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Donations</h2>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Amount to donate (ETH)"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={handleDonate}
            disabled={isDonating}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
          >
            {isDonating ? "Donating..." : "Donate"}
          </button>
        </div>

        {isLoadingDonations ? (
          <p>Loading donations...</p>
        ) : donations?.length ? (
          <ul className="mt-4">
            {donations.map((donation, index) => (
              <li key={index}>
                {donation.donor}: {formatEther(donation.amount)} ETH
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Withdraw Funds */}
      <div>
        <h2 className="text-xl font-bold">Withdraw Funds</h2>
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-red-300"
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}
