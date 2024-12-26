// types/crowdfunding.ts
export interface Campaign {
    id: bigint;
    title: string;
    description: string;
    targetAmount: bigint;
    raisedAmount: bigint;
    owner: string;
    isCompleted: boolean;
    createdAt: bigint;
    deadline: bigint;
  }
  
  export interface Donation {
    donor: string;
    amount: bigint;
    timestamp: bigint;
  }