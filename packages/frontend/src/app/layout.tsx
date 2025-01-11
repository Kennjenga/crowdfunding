import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "../config";

export const metadata: Metadata = {
  title: "pamoja",
  description: "A donation app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie")
  );

  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen mx-auto max-w-[98%] sm:max-w-[94%]`}
        style={{
          fontFamily: "Inter",
        }}
      >
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
