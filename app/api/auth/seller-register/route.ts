import { NextResponse } from "next/server";
import { userService } from "@/services/userService";
import { apiResponse } from "@/lib/api/response";

/**
 * POST /api/auth/seller-register
 * Register a new seller user
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      email,
      phoneNo,
      companyRegistrationNo,
      address,
      city,
      state,
      postalCode,
      establishmentYear,
      natureOfBusiness,
      panTanNo,
      contactName,
      contactPhoneNo,
      country,
      dob,
      taxId,
    } = body;

    // Validate required fields
    const errors: Record<string, string[]> = {};
    
    if (!companyName) errors.companyName = ["Company name is required"];
    if (!email) errors.email = ["Email is required"];
    if (!phoneNo) errors.phoneNo = ["Phone number is required"];
    if (!companyRegistrationNo) errors.companyRegistrationNo = ["Company registration number is required"];
    if (!contactName) errors.contactName = ["Contact name is required"];
    
    if (Object.keys(errors).length > 0) {
      return apiResponse.validationError(errors);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiResponse.validationError({
        email: ["Invalid email format"]
      });
    }

    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return apiResponse.validationError({
        email: ["User with this email already exists"]
      });
    }

    // Create the seller
    const newUser = await userService.createSeller({
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
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return apiResponse.success({
      message: "Seller registration successful. Please wait for admin approval. Your temporary password is 'Welcome'",
      user: userWithoutPassword,
    }, 201);
  } catch (error) {
    console.error("Error registering seller:", error);
    return apiResponse.error(error);
  }
}
