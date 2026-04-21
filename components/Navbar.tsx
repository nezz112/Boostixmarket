"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Gamepad2, PlusCircle, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
  };

  return (
    <nav className="fixed top-0 w-full bg-dark/90 backdrop-blur-md border-b border-neon-blue/20 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-neon-blue font-bold text-xl tracking-wider">
          <Gamepad2 className="text-neon-purple" />
          MLBB<span className="text-white">MARKET</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/sell" className="flex items-center gap-1 text-sm bg-neon-purple/20 text-neon-purple border border-neon-purple px-3 py-1.5 rounded-md hover:bg-neon-purple hover:text-white transition-all">
                <PlusCircle size={16} /> <span className="hidden md:inline">Sell Account</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-1 text-sm bg-neon-blue/20 text-neon-blue border border-neon-blue px-4 py-1.5 rounded-md hover:bg-neon-blue hover:text-dark transition-all">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
