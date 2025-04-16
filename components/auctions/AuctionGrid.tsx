"use client";

import React from "react";
import { Auction } from "@/types";
import { AuctionCard } from "./AuctionCard";

interface AuctionGridProps {
  auctions: Auction[];
  emptyMessage?: string;
}

/**
 * Grid layout for displaying multiple auction cards
 */
export function AuctionGrid({ 
  auctions, 
  emptyMessage = "No auctions found" 
}: AuctionGridProps) {
  if (!auctions || auctions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
