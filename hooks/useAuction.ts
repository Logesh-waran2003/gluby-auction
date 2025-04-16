"use client";

import { useState, useEffect } from "react";
import { Auction } from "@/types";
import { auctionService } from "@/services/auctionService";

/**
 * Custom hook for fetching and managing auction data
 */
export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/auctions/${auctionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch auction: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAuction(data.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    if (auctionId) {
      fetchAuction();
    }
  }, [auctionId]);

  /**
   * Refresh auction data
   */
  const refreshAuction = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/auctions/${auctionId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch auction: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAuction(data.data);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    auction, 
    isLoading, 
    error,
    refreshAuction
  };
}
