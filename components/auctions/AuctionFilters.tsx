"use client";

import React, { useState } from "react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";

interface FilterValues {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface AuctionFiltersProps {
  onFilter: (filters: FilterValues) => void;
}

/**
 * Filter component for auctions
 */
export function AuctionFilters({ onFilter }: AuctionFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });

  const handleChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "IRON", label: "Iron" },
    { value: "METAL", label: "Metal" },
    { value: "ALUMINIUM", label: "Aluminium" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "ending_soon", label: "Ending Soon" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Search auctions..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full"
        />
        
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleChange("category", value)}
          className="w-full"
        />
        
        <div className="flex space-x-2">
          <Input
            placeholder="Min $"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Max $"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => handleChange("sortBy", value)}
          className="w-full"
        />
        
        <div className="flex space-x-2">
          <Button type="submit" variant="primary" className="flex-1">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
