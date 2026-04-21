"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

export default function SellAccount() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!images || images.length === 0) return toast.error("Upload at least 1 image");

    setUploading(true);
    const form = new FormData(e.target);
    const imageUrls = [];

    try {
      // Upload Images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const storageRef = ref(storage, `accounts/${user.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // Save to Firestore
      await addDoc(collection(db, "listings"), {
        sellerId: user.uid,
        sellerEmail: user.email,
        title: form.get("title"),
        price: Number(form.get("price")),
        rank: form.get("rank"),
        heroesCount: Number(form.get("heroes")),
        skinsCount: Number(form.get("skins")),
        description: form.get("description"),
        sellerPhone: form.get("phone"),
        images: imageUrls,
        createdAt: serverTimestamp(),
      });

      toast.success("Account listed successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error creating listing.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-card border border-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4 text-neon-purple">Sell Your Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Listing Title</label>
          <input name="title" required placeholder="e.g. Mythic Glory | 120 Skins | Lightborn" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Price (USD)</label>
            <input type="number" name="price" required placeholder="50" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Current Rank</label>
            <select name="rank" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none">
              <option>Mythic Glory</option>
              <option>Mythic</option>
              <option>Legend</option>
              <option>Epic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Total Heroes</label>
            <input type="number" name="heroes" required placeholder="100" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Total Skins</label>
            <input type="number" name="skins" required placeholder="150" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none" />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">WhatsApp Number (For Buyers)</label>
          <input name="phone" required placeholder="+1234567890" className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none" />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">Description</label>
          <textarea name="description" required rows={4} placeholder="Mention rare skins, win rates, emblems..." className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-white focus:border-neon-blue outline-none"></textarea>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">Upload Screenshots (Max 3)</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full bg-dark border border-gray-800 rounded px-4 py-2 text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-neon-purple/20 file:text-neon-purple hover:file:bg-neon-purple/30 cursor-pointer" />
        </div>

        <button disabled={uploading} type="submit" className="w-full bg-neon-purple text-white font-bold rounded-lg py-3 mt-4 hover:shadow-[0_0_15px_rgba(176,38,255,0.5)] transition-all disabled:opacity-50">
          {uploading ? "Publishing Listing..." : "Post Account"}
        </button>
      </form>
    </div>
  );
}
