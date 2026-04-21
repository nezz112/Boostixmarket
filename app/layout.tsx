import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MLBB Market | Epic Accounts",
  description: "Buy and sell Mobile Legends accounts easily.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            {children}
          </main>
          <Toaster position="bottom-center" toastOptions={{ style: { background: '#151b2b', color: '#fff', border: '1px solid #b026ff' } }}/>
        </AuthProvider>
      </body>
    </html>
  );
}
