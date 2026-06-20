import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TickerBar from "./components/TickerBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cryptonite",
  description: "Your go-to Cryptonite website for all info about crypto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
        style={{ background: "#07071a" }}
      >
        {/* Animated ambient background orbs */}
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />
        </div>

        {/* Subtle cyber grid overlay */}
        <div className="cyber-grid" aria-hidden="true" />

        {/* App shell */}
        <Navbar />
        <TickerBar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
