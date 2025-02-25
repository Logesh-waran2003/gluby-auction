import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { auctionId, amount } = body;

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      return new NextResponse("Auction not found", { status: 404 });
    }

    if (auction.status !== "ACTIVE") {
      return new NextResponse("Auction is not active", { status: 400 });
    }

    if (new Date(auction.endTime) < new Date()) {
      return new NextResponse("Auction has ended", { status: 400 });
    }

    if (amount <= auction.currentPrice) {
      return new NextResponse("Bid must be higher than current price", {
        status: 400,
      });
    }

    if (session.user.id === auction.sellerId) {
      return new NextResponse("Cannot bid on your own auction", { status: 400 });
    }

    // Create bid and update auction price in a transaction
    const result = await prisma.$transaction([
      prisma.bid.create({
        data: {
          amount,
          auctionId,
          bidderId: session.user.id,
        },
      }),
      prisma.auction.update({
        where: { id: auctionId },
        data: { currentPrice: amount },
      }),
    ]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("[BIDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
