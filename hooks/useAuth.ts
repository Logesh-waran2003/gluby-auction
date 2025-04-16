"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Custom hook for authentication functionality
 */
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/dashboard");
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new buyer user
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return false;
      }

      // Auto login after registration
      return login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new seller
   */
  const registerSeller = async (formData: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/seller-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Seller registration failed");
        return false;
      }

      // Redirect to login page after seller registration
      router.push("/login?message=Seller registration successful. Please wait for admin approval.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during seller registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      router.push("/");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during logout");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    registerSeller,
    logout,
    isLoading,
    error,
  };
}
