import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { bidService } from "@/services/bidService";
import { auctionService } from "@/services/auctionService";
import { userService } from "@/services/userService";
import { apiResponse } from "@/lib/api/response";

/**
 * POST /api/bids
 * Create a new bid
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return apiResponse.unauthorized();
    }

    if (session.user.role !== "BUYER") {
      return apiResponse.forbidden("Only buyers can place bids");
    }

    const body = await req.json();
    const { amount, auctionId } = body;

    if (!amount || !auctionId) {
      return apiResponse.validationError({
        amount: !amount ? ["Bid amount is required"] : [],
        auctionId: !auctionId ? ["Auction ID is required"] : []
      });
    }

    // Validate bid amount is a number
    if (isNaN(Number(amount))) {
      return apiResponse.validationError({
        amount: ["Bid amount must be a valid number"]
      });
    }

    // Get the auction
    const auction = await auctionService.findById(auctionId);
    if (!auction) {
      return apiResponse.notFound("Auction not found");
    }

    // Check if auction is active
    if (auction.status !== "ACTIVE") {
      return apiResponse.forbidden("Cannot bid on inactive auctions");
    }

    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return apiResponse.forbidden("Auction has ended");
    }

    // Check if bid amount is higher than current price
    if (Number(amount) <= auction.currentPrice) {
      return apiResponse.validationError({
        amount: ["Bid amount must be higher than current price"]
      });
    }

    // Check if user has enough funds
    const user = await userService.findById(session.user.id);
    if (!user || user.amount < Number(amount)) {
      return apiResponse.forbidden("Insufficient funds to place this bid");
    }

    // Create the bid
    const bid = await bidService.create({
      amount: Number(amount),
      bidderId: session.user.id,
      auctionId,
    });

    return apiResponse.success(bid, 201);
  } catch (error) {
    console.error("Error creating bid:", error);
    return apiResponse.error(error);
  }
}

/**
 * GET /api/bids
 * Get bids for an auction or by a user
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const auctionId = searchParams.get("auctionId");
    const bidderId = searchParams.get("bidderId");
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiResponse.unauthorized();
    }

    if (auctionId) {
      const bids = await bidService.findByAuctionId(auctionId);
      return apiResponse.success(bids);
    } else if (bidderId) {
      // Only allow users to see their own bids unless they're an admin
      if (bidderId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
        return apiResponse.forbidden("You can only view your own bids");
      }
      
      const bids = await bidService.findByBidderId(bidderId);
      return apiResponse.success(bids);
    } else {
      return apiResponse.validationError({
        query: ["Either auctionId or bidderId is required"]
      });
    }
  } catch (error) {
    console.error("Error fetching bids:", error);
    return apiResponse.error(error);
  }
}
