"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-orange-50 py-6 relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-purple-700">
            Pamoja
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-purple-700 hover:text-purple-900 z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex gap-6 items-center">
            <Link
              href="/how-it-works"
              className="text-purple-700 hover:text-purple-900"
            >
              How it Works
            </Link>
            <Link
              href="/campaign"
              className="text-purple-700 hover:text-purple-900"
            >
              Campaigns
            </Link>
            <Link
              href="/create-campaign"
              className="text-purple-700 hover:text-purple-900"
            >
              Start Fundraising
            </Link>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-1/2 h-screen bg-orange-50 shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
            isMenuOpen
              ? "transform translate-x-0"
              : "transform -translate-x-full"
          }`}
        >
          {/* Mobile Logo */}
          <div className="p-6 border-b border-purple-200">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-700 hover:text-purple-900"
            >
              Pamoja
            </Link>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <Link
              href="/how-it-works"
              className="text-purple-700 hover:bg-purple-100 rounded-lg py-3 px-4 transition-colors duration-200"
              onClick={toggleMenu}
            >
              How it Works
            </Link>
            <Link
              href="/campaign"
              className="text-purple-700 hover:bg-purple-100 rounded-lg py-3 px-4 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Campaigns
            </Link>
            <Link
              href="/create-campaign"
              className="text-purple-700 hover:bg-purple-100 rounded-lg py-3 px-4 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Start Fundraising
            </Link>
            <div className="py-2 px-4">
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
