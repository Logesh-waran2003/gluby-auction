import { NextResponse } from "next/server";
import { userService } from "@/services/userService";
import { apiResponse } from "@/lib/api/response";

/**
 * POST /api/auth/register
 * Register a new buyer user
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Validate required fields
    const errors: Record<string, string[]> = {};
    
    if (!email) errors.email = ["Email is required"];
    if (!password) errors.password = ["Password is required"];
    if (!name) errors.name = ["Name is required"];
    
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

    // Validate password strength
    if (password.length < 8) {
      return apiResponse.validationError({
        password: ["Password must be at least 8 characters long"]
      });
    }

    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return apiResponse.validationError({
        email: ["User with this email already exists"]
      });
    }

    // Create the user
    const newUser = await userService.createBuyer({
      email,
      password,
      name,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return apiResponse.success({
      message: "User registered successfully",
      user: userWithoutPassword,
    }, 201);
  } catch (error) {
    console.error("Error registering user:", error);
    return apiResponse.error(error);
  }
}
