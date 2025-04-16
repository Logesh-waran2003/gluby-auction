import { NextResponse } from "next/server";

/**
 * Standardized API response utility
 * Provides consistent response format across all API endpoints
 */
export const apiResponse = {
  /**
   * Return a success response
   * @param data - The data to return
   * @param status - HTTP status code (default: 200)
   */
  success: <T>(data: T, status = 200) => {
    return NextResponse.json(
      { 
        success: true, 
        data 
      }, 
      { status }
    );
  },

  /**
   * Return an error response
   * @param error - The error object or message
   * @param status - HTTP status code (default: 500)
   */
  error: (error: unknown, status = 500) => {
    // Extract error message based on error type
    const message = error instanceof Error 
      ? error.message 
      : String(error);
    
    // Include stack trace in development
    const details = process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.stack
      : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: message,
        ...(details && { details })
      }, 
      { status }
    );
  },

  /**
   * Return a validation error response
   * @param errors - Validation errors
   */
  validationError: (errors: Record<string, string[]>) => {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        errors
      },
      { status: 400 }
    );
  },

  /**
   * Return an unauthorized error response
   * @param message - Optional custom message
   */
  unauthorized: (message = "Unauthorized") => {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 401 }
    );
  },

  /**
   * Return a forbidden error response
   * @param message - Optional custom message
   */
  forbidden: (message = "Forbidden") => {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 403 }
    );
  },

  /**
   * Return a not found error response
   * @param message - Optional custom message
   */
  notFound: (message = "Resource not found") => {
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 404 }
    );
  }
};
