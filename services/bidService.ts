import prisma from "@/lib/prisma";
import { auctionService } from "./auctionService";

export class BidService {
  /**
   * Get all bids for an auction
   */
  async findByAuctionId(auctionId: string) {
    return prisma.bid.findMany({
      where: { auctionId },
      include: {
        bidder: true,
      },
      orderBy: {
        amount: "desc",
      },
    });
  }

  /**
   * Get all bids by a user
   */
  async findByBidderId(bidderId: string) {
    return prisma.bid.findMany({
      where: { bidderId },
      include: {
        auction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Create a new bid
   */
  async create(data: { amount: number; bidderId: string; auctionId: string }) {
    const { amount, bidderId, auctionId } = data;

    // Create the bid in a transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      // Create the bid
      const bid = await tx.bid.create({
        data: {
          amount,
          bidderId,
          auctionId,
        },
        include: {
          bidder: true,
          auction: true,
        },
      });

      // Update the auction's current price
      await tx.auction.update({
        where: { id: auctionId },
        data: { currentPrice: amount },
      });

      return bid;
    });
  }

  /**
   * Get the highest bid for an auction
   */
  async getHighestBid(auctionId: string) {
    return prisma.bid.findFirst({
      where: { auctionId },
      orderBy: {
        amount: "desc",
      },
      include: {
        bidder: true,
      },
    });
  }

  /**
   * Check if a bid is valid
   */
  async isValidBid(auctionId: string, amount: number): Promise<boolean> {
    const auction = await auctionService.findById(auctionId);
    
    if (!auction) {
      return false;
    }
    
    // Check if auction is active
    if (auction.status !== "ACTIVE") {
      return false;
    }
    
    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return false;
    }
    
    // Check if bid amount is higher than current price
    if (amount <= auction.currentPrice) {
      return false;
    }
    
    return true;
  }
}

// Export a singleton instance
export const bidService = new BidService();
