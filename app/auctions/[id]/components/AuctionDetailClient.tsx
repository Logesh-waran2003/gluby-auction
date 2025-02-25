"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { AuctionDetail } from "./AuctionDetail";
import { Session } from "next-auth";

interface AuctionDetailClientProps {
  auction: any; // Use a proper type definition matching your auction data
  session: Session | null;
}

export default function AuctionDetailClient({
  auction,
  session,
}: AuctionDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if the current user is not the seller
  const isNotSeller = session?.user?.id !== auction.sellerId;

  return (
    <div className="container mx-auto py-8 px-4">
      <AuctionDetail auction={auction} session={session} />

      {/* Only show chat button if user is logged in and is not the seller */}
      {session && isNotSeller && (
        <div className="mt-6">
          <Button
            variant="secondary"
            size="lg"
            className="w-full md:w-auto"
            onClick={() => setIsChatOpen(true)}
          >
            Chat with Seller
          </Button>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 shadow-xl rounded-lg">
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
    </div>
  );
}
