"use client";

import { AuctionCard } from "@/components/auctions/AuctionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Auction {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  images: string[];
  status: string;
  endTime: Date;
  seller: {
    name: string;
    id: string;
  };
  _count: {
    bids: number;
  };
}

export function SellerDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions/approved");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        setAuctions(data);
        console.log("dataApproved: ", data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6">
        <p>Loading auctions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-100 text-red-600 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center p-12 bg-muted rounded-lg">
        <h3 className="text-xl font-medium mb-4">Create your first auction</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any auctions yet. Start selling by creating your
          first auction.
        </p>
        <Link href="/auctions/create">
          <Button size="lg">Create New Auction</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">My Listed Auctions</h2>
        <Link href="/auctions/create">
          <Button>Create New Auction</Button>
        </Link>
      </div>

      <Input
        type="text"
        placeholder="Search your auctions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg"
      />

      {filteredAuctions.length === 0 ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No auctions match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}
