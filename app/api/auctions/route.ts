import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { auctionService } from "@/services/auctionService";
import { apiResponse } from "@/lib/api/response";
import { AuctionStatus } from "@prisma/client";

/**
 * GET /api/auctions
 * Get auctions with optional filtering
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as AuctionStatus | null;
    const sellerId = searchParams.get("sellerId");
    const approvalStatus = searchParams.get("approvalStatus");
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiResponse.unauthorized();
    }

    let options: any = {};
    
    if (status) {
      options.status = status;
    }
    
    if (sellerId) {
      options.sellerId = sellerId;
    }
    
    if (approvalStatus === "pending") {
      options.status = AuctionStatus.PENDING;
    } else if (approvalStatus === "approved") {
      options.status = AuctionStatus.ACTIVE;
    }

    const auctions = await auctionService.findAll(options);
    return apiResponse.success(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return apiResponse.error(error);
  }
}

/**
 * POST /api/auctions
 * Create a new auction
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiResponse.unauthorized();
    }

    if (session.user.role !== "SELLER") {
      return apiResponse.forbidden("Only sellers can create auctions");
    }

    if (!session.user.isApproved) {
      return apiResponse.forbidden("Your seller account is pending approval");
    }

    const rawBody = await req.text();
    const data = JSON.parse(rawBody);

    const {
      title,
      description,
      startPrice,
      endTime,
      images = [],
      itemType = "IRON",
    } = data;

    // Validate required fields
    const errors: Record<string, string[]> = {};
    
    if (!title?.trim()) errors.title = ["Title is required"];
    if (!description?.trim()) errors.description = ["Description is required"];
    if (!startPrice) errors.startPrice = ["Start price is required"];
    if (!endTime) errors.endTime = ["End time is required"];
    
    if (Object.keys(errors).length > 0) {
      return apiResponse.validationError(errors);
    }

    // Validate numerical startPrice
    if (isNaN(Number(startPrice))) {
      return apiResponse.validationError({
        startPrice: ["Start price must be a valid number"]
      });
    }

    // Validate itemType enum
    const validItemTypes = ["IRON", "METAL", "ALUMINIUM"];
    if (!validItemTypes.includes(itemType)) {
      return apiResponse.validationError({
        itemType: ["Invalid item type specified"]
      });
    }

    const auction = await auctionService.create({
      title: title.trim(),
      description: description.trim(),
      startPrice: Number(startPrice),
      currentPrice: Number(startPrice),
      endTime: new Date(endTime),
      images,
      itemType,
      sellerId: session.user.id,
    });

    return apiResponse.success(auction, 201);
  } catch (error) {
    console.error("Error creating auction:", error);
    return apiResponse.error(error);
  }
}
