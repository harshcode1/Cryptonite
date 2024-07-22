import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cryptonite",
  description: "Your go to cryptonite Website for all info about crypto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Navbar/>
      <div className="bg-white">
      {children}
      </div>
      <Footer/>
      </body>
    </html>
  );
}
