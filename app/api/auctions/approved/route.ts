import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuctionStatus, Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getAuthSession();
    const userId = session?.user?.id;

    // If no user is logged in, return empty response
    if (!userId) {
      return NextResponse.json([]);
    }

    // Get user role to determine if they're a seller
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isSeller = user?.role === Role.SELLER;

    // Fetch auctions based on user role
    const auctions = await prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        // isApproved: true,
        // If user is a seller, only show their own auctions
        ...(isSeller && { sellerId: userId }),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    // If user is logged in, fetch their favorites to mark favorite auctions
    let userFavorites: string[] = [];
    if (userId) {
      const favorites = await prisma.userFavorite.findMany({
        where: { userId },
        select: { auctionId: true },
      });
      userFavorites = favorites.map((fav) => fav.auctionId);
    }

    // Add isFavorite flag to each auction
    const auctionsWithFavorites = auctions.map((auction) => ({
      ...auction,
      isFavorite: userFavorites.includes(auction.id),
    }));

    return NextResponse.json(auctionsWithFavorites);
  } catch (error) {
    console.error("Error fetching approved auctions:", error);
    // Return a proper JSON error response
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}
