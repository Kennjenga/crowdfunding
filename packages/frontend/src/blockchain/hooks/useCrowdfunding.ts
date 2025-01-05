// hooks/useCrowdfunding.ts
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS, ADMIN_ADDRESS } from '@/blockchain/abis/Crowdfunding'

export function useCrowdfunding() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()

  const { data: campaigns, refetch: refetchCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getAllCampaigns',
  })

  const createCampaign = async (title: string, description: string, targetAmount: number, duration: number) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'createCampaign',
      args: [title, description, targetAmount, duration],
    })
  }

  const donateToCampaign = async (campaignId: number, amount: bigint) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'donateToCampaign',
      args: [campaignId],
      value: amount,
    })
  }

  const withdrawFunds = async (campaignId: number) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'withdrawFunds',
      args: [campaignId],
    })
  }

  const deleteCampaign = async (campaignId: number) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'deleteCampaign',
      args: [campaignId],
    })
  }

  const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  return {
    campaigns,
    createCampaign,
    donateToCampaign,
    withdrawFunds,
    deleteCampaign,
    refetchCampaigns,
    isAdmin,
    userAddress: address
  }
}