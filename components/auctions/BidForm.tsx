"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Auction } from "@/types";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils";
import { useBid } from "@/hooks/useBid";

interface BidFormProps {
  auction: Auction;
  onBidPlaced?: () => void;
}

/**
 * Form component for placing bids on auctions
 */
export function BidForm({ auction, onBidPlaced }: BidFormProps) {
  const { data: session } = useSession();
  const { bidAmount, setBidAmount, submitBid, isSubmitting, error, success, canBid } = useBid(auction.id);
  
  // Set minimum bid amount
  useEffect(() => {
    setBidAmount(auction.currentPrice + 1);
  }, [auction.currentPrice, setBidAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitBid();
    if (result && onBidPlaced) {
      onBidPlaced();
    }
  };

  // Check if auction has ended
  const isEnded = new Date() > new Date(auction.endTime);
  
  // Check if user is the seller
  const isSeller = session?.user?.id === auction.sellerId;

  if (isEnded) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700 font-medium">This auction has ended</p>
      </div>
    );
  }

  if (isSeller) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700 font-medium">You cannot bid on your own auction</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700 font-medium mb-2">Sign in to place a bid</p>
        <Button variant="primary" onClick={() => window.location.href = "/login"}>
          Sign In
        </Button>
      </div>
    );
  }

  if (!canBid) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700 font-medium">Only buyers can place bids</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Place Your Bid</h3>
      
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-xl font-bold text-indigo-600">
            {formatCurrency(auction.currentPrice)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Minimum Bid</p>
          <p className="text-xl font-medium">
            {formatCurrency(auction.currentPrice + 1)}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          label="Your Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          min={auction.currentPrice + 1}
          step="1"
          required
          fullWidth
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting || bidAmount <= auction.currentPrice}
        >
          Place Bid
        </Button>
      </form>
    </div>
  );
}
