import { formatUnits } from "ethers";


// types/crowdfunding.ts
export interface Campaign {
  fundsWithdrawn: bigint;
  id: bigint;
  title: string;
  description: string;
  targetAmount: bigint;
  raisedAmount: bigint;
  owner: string;
  isCompleted: boolean;
  createdAt: bigint;
  deadline: bigint;
  isDeleted: boolean;
}

export interface Donation {
  donor: string;
  amount: bigint;
  timestamp: bigint;
}

export const weiToETH = (wei: bigint | string | number) => {
    // console.log("Input Wei:", wei.toString());
    const eth = formatUnits(wei.toString(), 18);
    // console.log("Converted ETH:", eth);
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(Number(eth));
    // console.log("Formatted ETH:", formatted);
    return formatted;
  };