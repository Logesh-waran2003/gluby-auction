"use client";

import React from "react";
import Link from "next/link";

/**
 * Footer component for the application
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              Gluby
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              The premier destination for secure and engaging online auctions.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/auctions"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Browse Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sellerRegister"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-base text-gray-300">
                Email: info@gluby.com
              </li>
              <li className="text-base text-gray-300">
                Phone: +1 (555) 123-4567
              </li>
              <li className="text-base text-gray-300">
                Address: 123 Auction St, City, Country
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-base text-gray-400">
            &copy; {currentYear} Gluby. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
