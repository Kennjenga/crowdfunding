import Navbar from "@/components/navbar";
import { ChevronDown } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />

      <div className="place-items-center">
        <div className="rounded-lg shadow-lg p-8 max-w-[90%] mt-8">
          {/* <!-- Donation Section --> */}
          <section className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">
              Donate to Your Favorite Campaign
            </h1>
            <p>
              You can donate to any campaign available. Connect your wallet and
              support your favorite charities.
            </p>
          </section>

          {/* <!-- Campaign Creation Section --> */}
          <section className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Want to Create a Campaign?
            </h2>
            <p>
              Send a proposition to the admin to validate the authenticity of
              your campaign at
              <span className="font-semibold text-blue-600 ms-1">
                kinyagia17@gmail.com
              </span>
              . Include your public wallet address to be granted a campaign
              creator role. After that, proceed to create your campaign!
            </p>
            <details className="p-4 lg:p-6 bg-white rounded-2xl shadow-lg mt-8 text-start">
              <summary className="font-semibold text-purple-900 cursor-pointer flex justify-between items-center">
                What to send?
                <ChevronDown className="text-orange-500" />
              </summary>
              <li className="mt-4 text-purple-700">Campaign Details</li>
              <li className="mt-4 text-purple-700">Campaign Document Proof</li>
              <li className="mt-4 text-purple-700">
                For more validation your organisation details and course
              </li>
            </details>
          </section>
        </div>
      </div>
    </>
  );
};

export default page;
