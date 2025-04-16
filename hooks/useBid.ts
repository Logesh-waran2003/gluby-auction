"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAuction } from "./useAuction";

/**
 * Custom hook for managing bidding functionality
 */
export function useBid(auctionId: string) {
  const { data: session } = useSession();
  const { auction, refreshAuction } = useAuction(auctionId);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Set initial bid amount based on current price
  useEffect(() => {
    if (auction) {
      setBidAmount(auction.currentPrice + 1);
    }
  }, [auction]);

  /**
   * Submit a bid
   */
  const submitBid = async () => {
    if (!session?.user) {
      setError("You must be logged in to place a bid");
      return;
    }

    if (!auction) {
      setError("Auction not found");
      return;
    }

    if (bidAmount <= auction.currentPrice) {
      setError("Bid amount must be higher than current price");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bidAmount,
          auctionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place bid");
      }

      const data = await response.json();
      setSuccess("Bid placed successfully!");
      
      // Refresh auction data to show updated price
      await refreshAuction();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bidAmount,
    setBidAmount,
    submitBid,
    isSubmitting,
    error,
    success,
    canBid: !!session?.user && session.user.role === "BUYER",
  };
}
