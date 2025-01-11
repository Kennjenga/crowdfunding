import { Heart, Users, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UrgentCampaign } from "@/components/campaigns/urgentCampaign";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-purple-900">
              Empower Change
            </h1>
            <p className="text-lg lg:text-xl text-purple-700 mb-8">
              Join our community of givers and make a lasting impact on lives
              around the world.
            </p>
            <Link
              href="/campaign"
              className="inline-block bg-orange-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition shadow-lg"
            >
              Start Giving Today
            </Link>
          </div>
          <div className="w-full lg:w-auto">
            <Image
              src="/pamoja1.jpeg"
              alt="People helping each other"
              width={500}
              height={400}
              className="rounded-2xl shadow-2xl w-full lg:w-auto"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mb-20">
          <div className="text-center bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
            <Heart className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Immediate Impact
            </h3>
            <p className="text-purple-700">
              Your generosity creates instant positive change in someone&apos;s
              life.
            </p>
          </div>
          <div className="text-center bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
            <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Community Power
            </h3>
            <p className="text-purple-700">
              Unite with others to amplify your impact and reach.
            </p>
          </div>
          <div className="text-center bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
            <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Global Reach
            </h3>
            <p className="text-purple-700">
              Support causes and individuals across the world.
            </p>
          </div>
        </div>

        {/* Urgent campaigns */}
        <UrgentCampaign />

        {/* Statistics */}
        <div className="text-center py-12 lg:py-20 bg-purple-100 rounded-3xl mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-purple-900">
            2+
          </h2>
          <p className="text-xl lg:text-2xl text-purple-700 mb-8">
            Generous Souls Making a Difference
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-purple-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="p-4 lg:p-6 bg-white rounded-2xl shadow-lg">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                Is My Donation Tax Deductible?
                <ChevronDown className="text-orange-500" />
              </summary>
              <p className="mt-4 text-purple-700">
                Most donations on our platform are tax-deductible. We provide
                donation receipts for your records.
              </p>
            </details>
            <details className="p-4 lg:p-6 bg-white rounded-2xl shadow-lg">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                How Will My Donation Be Used?
                <ChevronDown className="text-orange-500" />
              </summary>
              <p className="mt-4 text-purple-700">
                Your donation goes directly to the campaign you choose, minus a
                small platform fee for operational costs.
              </p>
            </details>
            <details className="p-4 lg:p-6 bg-white rounded-2xl shadow-lg">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                Can I Set Up A Recurring Donation?
                <ChevronDown className="text-orange-500" />
              </summary>
              <p className="mt-4 text-purple-700">
                Yes, you can set up monthly recurring donations to support your
                favorite causes consistently.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
