import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { type Address } from 'viem'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/blockchain/abis/Crowdfunding'


// Separate hooks for individual campaign data
export function useGetCampaign(campaignId: bigint) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getCampaign',
    args: [campaignId],
  })
}

export function useGetCampaignDonations(campaignId: bigint) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getCampaignDonations',
    args: [campaignId],
  })
}

export function useGetDonorContribution(campaignId: bigint, donor: Address) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getDonorContribution',
    args: [campaignId, donor],
  })
}

// Main crowdfunding hook
export function useCrowdfunding() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()

  // Read functions
  const { data: campaigns, refetch: refetchCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getAllCampaigns',
  })

  const { data: totalCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getTotalCampaigns',
  })

  const { data: totalActiveCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getTotalActiveCampaigns',
  })

  // Get role bytes first
  const { data: creatorRole } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'CAMPAIGN_CREATOR_ROLE',
  })

  const { data: adminRole } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

  // Role checking functions
  const { data: isCreator } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'hasRole',
    args: address && creatorRole ? [creatorRole, address] : undefined,
    query: {
      enabled: Boolean(address && creatorRole),
    },
  })

  const { data: isAdmin } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'hasRole',
    args: address && adminRole ? [adminRole, address] : undefined,
    query: {
      enabled: Boolean(address && adminRole),
    },
  })

  // Campaign creation and management
  const createCampaign = async (
    title: string, 
    description: string, 
    targetAmount: bigint, 
    durationInDays: number
  ) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'createCampaign',
      args: [title, description, targetAmount, durationInDays],
    })
  }

  const donateToCampaign = async (campaignId: bigint, amount: bigint) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'donateToCampaign',
      args: [campaignId],
      value: amount,
    })
  }

  const withdrawFunds = async (campaignId: bigint) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'withdrawFunds',
      args: [campaignId],
    })
  }

  const deleteCampaign = async (campaignId: bigint) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'deleteCampaign',
      args: [campaignId],
    })
  }

  // Role management functions
  const grantCampaignCreatorRole = async (account: Address) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'grantCampaignCreatorRole',
      args: [account],
    })
  }

  const grantRole = async (role: `0x${string}`, account: Address) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'grantRole',
      args: [role, account],
    })
  }

  const revokeRole = async (role: `0x${string}`, account: Address) => {
    return writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'revokeRole',
      args: [role, account],
    })
  }

  return {
    // Data
    campaigns,
    totalCampaigns,
    totalActiveCampaigns,
    
    // Role status
    isAdmin,
    isCreator,
    userAddress: address,
    
    // Campaign management
    createCampaign,
    donateToCampaign,
    withdrawFunds,
    deleteCampaign,
    
    // Data retrieval moved to separate hooks
    refetchCampaigns,
    
    // Role management
    grantCampaignCreatorRole,
    grantRole,
    revokeRole,
  }
}