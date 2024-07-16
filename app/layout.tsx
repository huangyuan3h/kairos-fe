import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Provider } from "@/components/provider";
import { LeftMenu } from "@/components/LeftMenu";
import { Header } from "@/components/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kairos - AI-Driven Quantitative Stock Prediction",
  description:
    "Kairos leverages advanced AI algorithms to provide accurate and timely stock predictions, helping investors make informed decisions and maximize returns. Discover the power of AI in financial markets with Kairos.",
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
