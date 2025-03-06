import { PrismaClient, Role, AuctionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  // Create admin

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: Role.SUPER_ADMIN,
      isApproved: true,
    },
  });
  console.log("Seed completed successfully!");
  console.log("Admin: ", admin)
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
