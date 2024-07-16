import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Provider } from "@/components/provider";
import { LeftMenu } from "@/components/LeftMenu";
import { Header } from "@/components/Header";
import { DOMAIN_URL } from "@/config/domain";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kairos - AI-Driven Quantitative Stock Prediction",
  description:
    "Kairos leverages advanced AI algorithms to provide accurate and timely stock predictions, helping investors make informed decisions and maximize returns. Discover the power of AI in financial markets with Kairos.",
  authors: { name: "Yuan Huang", url: "https://github.com/huangyuan3h" },
  icons: [
    { url: "/favicon.ico" },
    { url: "/apple-touch-icon.png", rel: "apple-touch-icon", sizes: "180x180" },
    {
      url: "/favicon-32x32.png",
      rel: "icon",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/favicon-16x16.png",
      rel: "icon",
      sizes: "16x16",
      type: "image/png",
    },
  ],
  creator: "Yuan Huang",
  themeColor: "#ffffff",
  applicationName: "Kairos",
  manifest: "/site.webmanifest",
  metadataBase: new URL(DOMAIN_URL),
  other: {
    "msapplication-TileColor": "#da532c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          <div className="grid h-screen w-full pl-[56px]">
            <LeftMenu />
            <div className="flex flex-col">
              <Header />
              <main>{children}</main>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
