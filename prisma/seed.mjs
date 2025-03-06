import { PrismaClient, Role, AuctionStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.watchlist.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.auction.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
}

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await clearDatabase();

  // Create users
  const buyer = await prisma.user.create({
    data: {
      name: "John Buyer",
      email: "buyer@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.BUYER,
      isApproved: true,
      profile: {
        create: {
          email: "buyer@example.com",
          phone: "1234567890",
          city: "Chennai",
          state: "Tamil Nadu",
          country: "India",
          dob: new Date("1990-01-01"),
        },
      },
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: "Jane Seller",
      email: "seller@example.com",
      password: await bcrypt.hash("password123", 10),
      role: Role.SELLER,
      isApproved: true,
      profile: {
        create: {
          email: "seller@example.com",
          phone: "9876543210",
          company: "Metal Corp",
          companyRegNo: "MC123456",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          taxId: "TAX123456",
          establishedAt: new Date("2020-01-01"),
          natureOfBusiness: "Metal Trading",
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: Role.SUPER_ADMIN,
      isApproved: true,
    },
  });

  console.log("Users created successfully! : ", admin);

  // Create auctions
  const auction1 = await prisma.auction.create({
    data: {
      title: "Industrial Iron Scrap",
      description: "High quality industrial iron scrap - 1000kg",
      startPrice: 50000,
      currentPrice: 50000,
      itemType: "IRON",
      images: ["iron1.jpg", "iron2.jpg"],
      seller: { connect: { id: seller.id } },
      status: AuctionStatus.ACTIVE,
      isApproved: true,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const auction2 = await prisma.auction.create({
    data: {
      title: "Copper Wire Scrap",
      description: "Clean copper wire scrap - 500kg",
      startPrice: 75000,
      currentPrice: 76000,
      itemType: "COPPER",
      images: ["copper1.jpg"],
      seller: { connect: { id: seller.id } },
      status: AuctionStatus.ACTIVE,
      isApproved: true,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
  });

  // Create bids
  await prisma.bid.create({
    data: {
      amount: 76000,
      bidder: { connect: { id: buyer.id } },
      auction: { connect: { id: auction2.id } },
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      text: "Is bulk quantity available?",
      user: { connect: { id: buyer.id } },
      auction: { connect: { id: auction1.id } },
    },
  });

  // Create watchlist entry
  await prisma.watchlist.create({
    data: {
      user: { connect: { id: buyer.id } },
      auction: { connect: { id: auction1.id } },
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
