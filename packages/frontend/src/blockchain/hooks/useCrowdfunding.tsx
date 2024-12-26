import { useReadContract, useWriteContract } from "wagmi";
import {
  CROWDFUNDING_ABI,
  CROWDFUNDING_ADDRESS,
} from "@/blockchain/abis/Crowdfunding";
import { Campaign, Donation } from "@/types/crowdfunding";
import { parseEther } from "viem";

export function useCrowdfunding() {
  // Read total campaigns
  const { data: totalCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getTotalCampaigns",
  });

  // Custom hook for reading campaign details
  const useReadCampaign = (campaignId: bigint) => {
    return useReadContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "getCampaign",
      args: [campaignId],
    }) as { data: Campaign | undefined; isError: boolean; isPending: boolean };
  };

  // Custom hook for reading campaign donations
  const useReadCampaignDonations = (campaignId: bigint) => {
    return useReadContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "getCampaignDonations",
      args: [campaignId],
    }) as {
      data: Donation[] | undefined;
      isError: boolean;
      isPending: boolean;
    };
  };

  // Custom hook for reading donor contribution
  const useReadDonorContribution = (campaignId: bigint, donor: string) => {
    return useReadContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "getDonorContribution",
      args: [campaignId, donor],
    });
  };

  // Write Functions
  const useCreateCampaign = () => {
    const { writeContract, isError, isPending } = useWriteContract();

    const createCampaign = (
      title: string,
      description: string,
      targetAmountInEther: string,
      durationInDays: number
    ) => {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "createCampaign",
        args: [
          title,
          description,
          parseEther(targetAmountInEther),
          BigInt(durationInDays),
        ],
      });
    };

    return { createCampaign, isError, isPending };
  };

  const useDonate = () => {
    const { writeContract, isError, isPending } = useWriteContract();

    const donate = (campaignId: bigint, amountInEther: string) => {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "donateToCampaign",
        args: [campaignId],
        value: parseEther(amountInEther),
      });
    };

    return { donate, isError, isPending };
  };

  const useWithdraw = () => {
    const { writeContract, isError, isPending } = useWriteContract();

    const withdraw = (campaignId: bigint) => {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "withdrawFunds",
        args: [campaignId],
      });
    };

    return { withdraw, isError, isPending };
  };

  return {
    totalCampaigns,
    useReadCampaign,
    useReadCampaignDonations,
    useReadDonorContribution,
    useCreateCampaign,
    useDonate,
    useWithdraw,
  };
}
