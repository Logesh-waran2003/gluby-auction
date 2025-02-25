"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface AuctionDetailProps {
  auction: {
    id: string;
    title: string;
    description: string;
    currentPrice: number;
    images: string[];
    status: string;
    endTime: Date;
    sellerId: string;
    seller: {
      name: string;
      id: string;
    };
    bids: {
      id: string;
      amount: number;
      bidder: {
        name: string;
      };
    }[];
    _count: {
      bids: number;
    };
  };
  session: Session | null;
}

export function AuctionDetail({ auction, session }: AuctionDetailProps) {
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + 1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBid = async () => {
    if (!session) {
      toast.error("Please sign in to place a bid");
      return;
    }

    if (bidAmount <= auction.currentPrice) {
      toast.error("Bid amount must be higher than current price");
      return;
    }

    if (auction.status !== "ACTIVE") {
      toast.error("This auction is not active");
      return;
    }

    if (new Date(auction.endTime) < new Date()) {
      toast.error("This auction has ended");
      return;
    }

    if (session.user.id === auction.sellerId) {
      toast.error("You cannot bid on your own auction");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId: auction.id,
          amount: bidAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place bid");
      }

      toast.success("Bid placed successfully!");
      // Refresh the page to show the new bid
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to place bid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative aspect-square">
          <Image
            src={auction.images[0] || "/placeholder-auction.jpeg"}
            alt={auction.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {auction.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {auction.images.slice(1).map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`${auction.title} - Image ${index + 2}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{auction.title}</h1>
          <p className="text-muted-foreground">
            Listed by {auction.seller.name}
          </p>
          <p className="bg-slate-100 rounded-full p-1 w-12 font-bold">
            {"IRON"}
          </p>
        </div>

        <p className="text-lg">{auction.description}</p>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">₹{auction.currentPrice}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-lg">
                {formatDistanceToNow(new Date(auction.endTime), {
                  addSuffix: true,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Bids</p>
              <p className="text-lg">{auction._count.bids}</p>
            </div>

            {auction.status === "ACTIVE" &&
              new Date(auction.endTime) > new Date() &&
              session?.user.id !== auction.sellerId && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={auction.currentPrice + 1}
                      step="1"
                    />
                    <Button onClick={handleBid} disabled={isLoading}>
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Minimum bid: ₹{auction.currentPrice + 1}
                  </p>
                </div>
              )}
          </div>
        </Card>

        {/* {auction.bids.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Bids</h2>
            <div className="space-y-2">
              {auction.bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <span>{bid.bidder.name}</span>
                  <span className="font-semibold">₹{bid.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
