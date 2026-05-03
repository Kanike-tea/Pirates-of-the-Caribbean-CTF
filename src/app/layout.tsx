import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Pirates of the Caribbean CTF — Cybersecurity Treasure Hunt",
  description:
    "A pirate-themed Capture The Flag cybersecurity challenge. 10 teams race across the seven seas, solving medium-to-hard security puzzles to claim the Black Pearl!",
  keywords: ["CTF", "cybersecurity", "pirates", "capture the flag", "treasure hunt", "security challenges"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen parchment-bg">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
