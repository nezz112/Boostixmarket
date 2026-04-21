"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MessageCircle, ShieldCheck, Trash2 } from "lucide-react";

export default function AccountDetails({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "listings", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error("Account not found");
        router.push("/");
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "listings", params.id));
      toast.success("Listing deleted!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const contactSeller = () => {
    if (!user) {
      toast.error("Please login to contact the seller");
      router.push("/login");
      return;
    }
    const message = `Hi! I'm interested in buying your MLBB account: ${listing.title} for $${listing.price}.`;
    window.open(`https://wa.me/${listing.sellerPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <div className="mt-20 text-center text-neon-blue animate-pulse">Loading secure data...</div>;
  if (!listing) return null;

  const isAdmin = user?.email === "admin@example.com"; // Change to your email for Admin Panel feature
  const isOwner = user?.uid === listing.sellerId;

  return (
    <div className="mt-8 max-w-4xl mx-auto bg-card border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-2">
        <div className="bg-black/50 p-4">
          <img src={listing.images[0]} alt="Main" className="w-full h-80 object-cover rounded-lg border border-gray-800" />
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {listing.images.slice(1).map((img: string, i: number) => (
              <img key={i} src={img} alt="Gallery" className="w-20 h-20 object-cover rounded border border-gray-700" />
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-white mb-2">{listing.title}</h1>
            {(isOwner || isAdmin) && (
              <button onClick={handleDelete} className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition">
                <Trash2 size={20} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-neon-purple/20 text-neon-purple border border-neon-purple px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{listing.rank}</span>
            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full"><ShieldCheck size={14}/> Verified</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-dark p-3 rounded-lg border border-gray-800">
              <span className="text-gray-500 block">Total Heroes</span>
              <span className="text-white font-bold text-lg">{listing.heroesCount}</span>
            </div>
            <div className="bg-dark p-3 rounded-lg border border-gray-800">
              <span className="text-gray-500 block">Total Skins</span>
              <span className="text-white font-bold text-lg">{listing.skinsCount}</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm whitespace-pre-wrap flex-1 bg-dark p-4 rounded-lg border border-gray-800 mb-6">
            {listing.description}
          </p>

          <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Price</p>
              <p className="text-3xl font-black text-neon-blue">${listing.price}</p>
            </div>
            <button 
              onClick={contactSeller}
              className="flex items-center gap-2 bg-neon-blue text-dark font-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
              <MessageCircle size={20} /> Buy / Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
