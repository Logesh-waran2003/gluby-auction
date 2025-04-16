import prisma from "@/lib/prisma";
import { AuctionStatus } from "@prisma/client";

export class AuctionService {
  /**
   * Get all auctions with optional filtering
   */
  async findAll(options?: { status?: AuctionStatus; isApproved?: boolean }) {
    return prisma.auction.findMany({
      where: options,
      include: {
        seller: {
          include: {
            profile: true,
          },
        },
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get approved auctions
   */
  async getApprovedAuctions() {
    return this.findAll({ status: AuctionStatus.ACTIVE, isApproved: true });
  }

  /**
   * Get pending auctions
   */
  async getPendingAuctions() {
    return this.findAll({ status: AuctionStatus.PENDING });
  }

  /**
   * Get auction by ID
   */
  async findById(id: string) {
    return prisma.auction.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            profile: true,
          },
        },
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  /**
   * Create a new auction
   */
  async create(data: {
    title: string;
    description: string;
    startPrice: number;
    currentPrice: number;
    itemType: string;
    images: string[];
    sellerId: string;
    endTime: Date;
  }) {
    return prisma.auction.create({
      data: {
        ...data,
        status: AuctionStatus.PENDING,
        isApproved: false,
      },
      include: {
        seller: true,
      },
    });
  }

  /**
   * Update auction approval status
   */
  async updateApprovalStatus(id: string, approved: boolean) {
    return prisma.auction.update({
      where: { id },
      data: {
        status: approved ? AuctionStatus.ACTIVE : AuctionStatus.REJECTED,
        isApproved: approved,
      },
    });
  }

  /**
   * Update auction current price
   */
  async updateCurrentPrice(id: string, price: number) {
    return prisma.auction.update({
      where: { id },
      data: { currentPrice: price },
    });
  }

  /**
   * Get auctions by seller ID
   */
  async findBySellerId(sellerId: string) {
    return prisma.auction.findMany({
      where: { sellerId },
      include: {
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get auctions that are ending soon
   */
  async getEndingSoonAuctions(limit = 5) {
    const now = new Date();
    return prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        isApproved: true,
        endTime: {
          gt: now,
        },
      },
      orderBy: {
        endTime: "asc",
      },
      take: limit,
      include: {
        seller: true,
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
      },
    });
  }
}

// Export a singleton instance
export const auctionService = new AuctionService();
