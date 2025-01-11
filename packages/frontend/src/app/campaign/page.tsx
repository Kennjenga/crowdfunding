// app/page.tsx
"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Profile } from "@/components/profile";
import Link from "next/link";
import { CampaignGrid } from "@/components/campaigns/CampaignGrid";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-4">
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pamoja</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/create-campaign"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              Create Campaign
            </Link>
            <Link
              href="/grant-creator"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
            >
              Manage Creators
            </Link>
            <ConnectButton />
          </div>
        </nav>
        <Profile />
        <CampaignGrid />
      </div>
    </div>
  );
}
