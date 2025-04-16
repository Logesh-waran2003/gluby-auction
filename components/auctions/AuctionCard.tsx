"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Auction } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { formatCurrency, getTimeRemainingText } from "@/lib/utils";

interface AuctionCardProps {
  auction: Auction;
}

/**
 * Card component for displaying auction information
 */
export function AuctionCard({ auction }: AuctionCardProps) {
  const {
    id,
    title,
    description,
    currentPrice,
    images,
    endTime,
    bids = [],
  } = auction;

  // Get the first image or use a placeholder
  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder-auction.webp";

  // Calculate time remaining
  const timeRemaining = getTimeRemainingText(endTime);
  
  // Check if auction has ended
  const isEnded = new Date() > new Date(endTime);
  
  // Get bid count
  const bidCount = bids.length;

  return (
    <Card className="h-full flex flex-col transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {timeRemaining}
        </div>
      </div>
      
      <CardContent className="flex-grow">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-500">Current Bid</p>
            <p className="text-lg font-bold text-indigo-600">
              {formatCurrency(currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bids</p>
            <p className="text-lg font-medium">{bidCount}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-3">
        <Link href={`/auctions/${id}`} className="w-full">
          <Button
            variant={isEnded ? "secondary" : "primary"}
            fullWidth
          >
            {isEnded ? "View Details" : "Place Bid"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
