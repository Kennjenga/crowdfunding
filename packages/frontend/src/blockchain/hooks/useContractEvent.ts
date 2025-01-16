import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';

export function useContractEvent({
  address,
  abi,
  eventName,
  listener
}: {
  address: `0x${string}`;
  abi: any;
  eventName: string;
  listener: (log: any) => void;
}) {
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const unwatch = publicClient.watchContractEvent({
      address,
      abi,
      eventName,
      onLogs: (logs) => {
        for (const log of logs) {
          listener(log);
        }
      },
    });

    // Cleanup subscription when component unmounts
    return () => {
      unwatch();
    };
  }, [address, abi, eventName, listener, publicClient]);
}