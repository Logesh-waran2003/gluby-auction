"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chat from "../Chat";
import { useAuthStore } from "@/store/authStore";

interface AuctionCardProps {
  auction: {
    id: string;
    title: string;
    description: string;
    currentPrice: number;
    images: string[];
    status: string;
    endTime: Date;
    _count: {
      bids: number;
    };
    seller: {
      id: string;
      name: string;
    };
  };
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const userRole = user?.role;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/auctions/${auction.id}`);
  };

  console.log("auction: ", auction);

  return (
    <Card
      className="overflow-hidden cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-48 w-full">
        <Image
          src={auction.images[0] || "/placeholder-auction.jpeg"}
          alt={auction.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{auction.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {auction.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Current Price:</span> ₹
            {auction.currentPrice}
          </p>
          <p>
            <span className="font-medium">Bids:</span> {auction._count.bids}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={
                auction.status === "ACTIVE" ? "text-green-600" : "text-red-600"
              }
            >
              {auction.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Ends:</span>{" "}
            {formatDistanceToNow(new Date(auction.endTime), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsChatOpen(true);
          }}
        >
          {userRole === "SELLER" ? "Chat with Winner" : "Chat with Seller"}
        </Button>
      </CardFooter>

      {isChatOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 shadow-xl rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white w-[400px] rounded-t-lg flex justify-between items-center p-2 border-b">
            <h3 className="font-semibold">Chat - {auction.title}</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MdClose size={20} />
            </button>
          </div>
          <div className="h-[500px] w-[400px]">
            <Chat
              seller={{
                id: auction.seller.id,
                name: auction.seller.name,
              }}
              auctionTitle={auction.title}
              auctionId={auction.id}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
