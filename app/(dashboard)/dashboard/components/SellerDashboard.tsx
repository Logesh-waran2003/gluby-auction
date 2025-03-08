"use client";

import { AuctionCard } from "@/components/auctions/AuctionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Search, FilterX } from "lucide-react";

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
  itemType?: string; // Added itemType field
}

export function SellerDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]); // Separate state for filtered auctions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // New filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

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
        setFilteredAuctions(data); // Initialize filtered auctions with all auctions

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            data.map((auction: Auction) => auction.itemType).filter(Boolean)
          )
        );
        setCategories(uniqueCategories as string[]);

        // Find the maximum price
        const highestPrice = Math.max(
          ...data.map((auction: Auction) => auction.currentPrice),
          100000
        );
        setMaxPrice(highestPrice);
        setPriceRange([0, highestPrice]);

        console.log("Auctions Approved: ", data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    // Apply all filters (search query, category, price range)
    const filtered = auctions.filter((auction) => {
      const matchesSearch = auction.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || auction.itemType === selectedCategory;
      const matchesPrice =
        auction.currentPrice >= priceRange[0] &&
        auction.currentPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    setFilteredAuctions(filtered);
  }, [searchQuery, auctions, selectedCategory, priceRange]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, maxPrice]);
  };

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

      <Card className="p-3">
        <div className="flex flex-wrap gap-3">
          {/* Search input */}
          <div className="relative flex-grow min-w-[200px]">
            <Search
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search your auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Category filter */}
          <div className="w-full md:w-auto min-w-[180px]">
            <Select
              value={selectedCategory || undefined}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1 h-9 px-3"
          >
            <FilterX size={14} />
            Reset
          </Button>
        </div>

        {/* Price range */}
        <div className="mt-3 px-1">
          <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
            <span>Price: ${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={[0, maxPrice]}
            min={0}
            max={maxPrice}
            step={100}
            value={priceRange}
            onValueChange={(value: number[]) =>
              setPriceRange(value as [number, number])
            }
          />
        </div>
      </Card>

      {filteredAuctions.length === 0 ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No auctions match your search.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted-foreground my-2">
            Showing {filteredAuctions.length} of {auctions.length} auctions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
