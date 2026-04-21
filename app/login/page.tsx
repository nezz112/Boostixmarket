"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Gamepad2 } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Welcome back warrior!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to login");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-card border border-gray-800 p-8 rounded-xl w-full max-w-md text-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex justify-center mb-6">
          <Gamepad2 size={60} className="text-neon-blue" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Login to MLBB Market</h1>
        <p className="text-gray-400 mb-8 text-sm">Securely connect to buy or sell accounts.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
