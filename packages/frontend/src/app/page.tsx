import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowRight, Heart, Users, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";

const FeaturedCampaigns = [
  {
    title: "Urgent Medical Support",
    image: "/placeholder.svg?height=300&width=400",
    amount: "$25,000",
    raised: "$15,000",
    category: "Medical",
  },
  {
    title: "Educational Support Campaign",
    image: "/placeholder.svg?height=300&width=400",
    amount: "$34,500",
    raised: "$22,000",
    category: "Education",
  },
  {
    title: "Community Digital Support",
    image: "/placeholder.svg?height=300&width=400",
    amount: "$15,000",
    raised: "$8,000",
    category: "Community",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <Link href="/" className="text-3xl font-bold text-purple-700">
            Pamoja
          </Link>
          <div className="flex gap-6 items-center">
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
        </nav>

        {/* Hero Section */}
        <div className="py-20 flex items-center justify-between">
          <div className="max-w-lg">
            <h1 className="text-6xl font-bold mb-6 text-purple-900">
              Empower Change
            </h1>
            <p className="text-xl text-purple-700 mb-8">
              Join our community of givers and make a lasting impact on lives
              around the world.
            </p>
            <Link
              href="/campaign"
              className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition shadow-lg"
            >
              Start Giving Today
            </Link>
          </div>
          <Image
            src="/pamoja1.jpeg"
            alt="People helping each other"
            width={500}
            height={400}
            className="rounded-2xl shadow-2xl"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-12 mb-20">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <Heart className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Immediate Impact
            </h3>
            <p className="text-purple-700">
              Your generosity creates instant positive change in someone&apos;s
              life.
            </p>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Community Power
            </h3>
            <p className="text-purple-700">
              Unite with others to amplify your impact and reach.
            </p>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Global Reach
            </h3>
            <p className="text-purple-700">
              Support causes and individuals across the world.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="text-center py-20 bg-purple-100 rounded-3xl mb-20">
          <h2 className="text-5xl font-bold mb-4 text-purple-900">217,924+</h2>
          <p className="text-2xl text-purple-700 mb-8">
            Generous Souls Making a Difference
          </p>
          <Link
            href="/stories"
            className="text-orange-500 font-medium text-lg flex items-center gap-2 justify-center hover:text-orange-600"
          >
            Discover Heartwarming Stories <ArrowRight size={24} />
          </Link>
        </div>

        {/* Testimonial Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-purple-900 text-center">
            Voices of Impact
          </h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-xl text-purple-700 mb-4">
              &quot;Thanks to the generosity of donors on GiveHope, I was able
              to afford my life-saving surgery. I&apos;m forever grateful for
              this amazing community!&quot;
            </p>
            <p className="font-semibold text-purple-900">
              - Sarah M., Medical Campaign Beneficiary
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-purple-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="p-6 bg-white rounded-2xl shadow-lg">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                Is My Donation Tax Deductible?
                <ChevronDown className="text-orange-500" />
              </summary>
              <p className="mt-4 text-purple-700">
                Most donations on our platform are tax-deductible. We provide
                donation receipts for your records.
              </p>
            </details>
            <details className="p-6 bg-white rounded-2xl shadow-lg">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                How Will My Donation Be Used?
                <ChevronDown className="text-orange-500" />
              </summary>
              <p className="mt-4 text-purple-700">
                Your donation goes directly to the campaign you choose, minus a
                small platform fee for operational costs.
              </p>
            </details>
            <details className="p-6 bg-white rounded-2xl shadow-lg">
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
