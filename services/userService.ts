import prisma from "@/lib/prisma";
import { Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  /**
   * Find a user by their email address
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  }

  /**
   * Find a user by their ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
  }

  /**
   * Get all users with optional filtering
   */
  async findAll(options?: { role?: Role; isApproved?: boolean }) {
    return prisma.user.findMany({
      where: options,
      include: { profile: true }
    });
  }

  /**
   * Create a new buyer user
   */
  async createBuyer(data: { email: string; password: string; name: string }) {
    const { email, password, name } = data;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.BUYER,
        name,
        isApproved: true, // Buyers are automatically approved
      },
    });
  }

  /**
   * Create a new seller user with profile
   */
  async createSeller(data: {
    email: string;
    contactName: string;
    companyName: string;
    phoneNo: string;
    companyRegistrationNo: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    establishmentYear: string;
    natureOfBusiness: string;
    panTanNo: string;
    contactPhoneNo: string;
    country: string;
    dob: string;
    taxId: string;
  }) {
    const {
      email,
      contactName,
      companyName,
      phoneNo,
      companyRegistrationNo,
      address,
      city,
      state,
      postalCode,
      establishmentYear,
      natureOfBusiness,
      panTanNo,
      contactPhoneNo,
      country,
      dob,
      taxId,
    } = data;

    // Hash the default password "Welcome"
    const hashedPassword = await bcrypt.hash("Welcome", 10);

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.SELLER,
        name: contactName,
        isApproved: false, // Sellers need admin approval
        profile: {
          create: {
            email,
            phone: phoneNo,
            companyRegNo: companyRegistrationNo,
            address,
            city,
            state,
            pincode: postalCode,
            establishedAt: new Date(establishmentYear),
            natureOfBusiness,
            panNo: panTanNo,
            contactNo: contactPhoneNo,
            company: companyName,
            country,
            dob: new Date(dob),
            taxId,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Update a user's approval status
   */
  async updateApprovalStatus(id: string, isApproved: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isApproved }
    });
  }

  /**
   * Update a user's balance
   */
  async updateBalance(id: string, amount: number) {
    return prisma.user.update({
      where: { id },
      data: { amount }
    });
  }

  /**
   * Update a user's points
   */
  async updatePoints(id: string, points: number) {
    return prisma.user.update({
      where: { id },
      data: { points }
    });
  }

  /**
   * Verify if a password matches the stored hash
   */
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Export a singleton instance
export const userService = new UserService();
