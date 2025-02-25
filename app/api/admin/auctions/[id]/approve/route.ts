import { NextResponse } from "next/server";
import { PrismaClient, Role, AuctionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ message: "Not authenticated" }),
        {
          status: 401,
        }
      );
    }

    if (session.user.role !== Role.SUPER_ADMIN) {
      return new NextResponse(JSON.stringify({ message: "Not authorized" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const auctionId = params.id;

    // Verify auction exists and get seller info
    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        seller: true,
      },
    });

    if (!auction) {
      return new NextResponse(
        JSON.stringify({ message: "Auction not found" }),
        { status: 404 }
      );
    }

    // Check if seller is approved
    if (!auction.seller.isApproved) {
      return new NextResponse(
        JSON.stringify({
          message: "Cannot approve auction from unapproved seller",
        }),
        { status: 400 }
      );
    }

    // Use transaction for data consistency
    const updatedAuction = await prisma.$transaction(async (tx) => {
      // Update auction status
      const updated = await tx.auction.update({
        where: {
          id: auctionId,
        },
        data: {
          isApproved: body.approve,
          status: body.approve ? AuctionStatus.ACTIVE : AuctionStatus.CANCELLED,
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              isApproved: true,
            },
          },
        },
      });

      return updated;
    });

    return new NextResponse(
      JSON.stringify({
        message: body.approve
          ? "Auction approved successfully"
          : "Auction rejected successfully",
        auction: updatedAuction,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in auction approval:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to process auction approval",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
