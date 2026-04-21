"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Search, ShieldAlert } from "lucide-react";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("All");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchesRank = rankFilter === "All" || l.rank === rankFilter;
    return matchesSearch && matchesRank;
  });

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search accounts (e.g. Mythic Glory 100 skins)..."
            className="w-full bg-card border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-neon-blue text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-card border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-neon-purple text-white"
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
        >
          <option value="All">All Ranks</option>
          <option value="Mythic Glory">Mythic Glory</option>
          <option value="Mythic">Mythic</option>
          <option value="Legend">Legend</option>
          <option value="Epic">Epic</option>
          <option value="Grandmaster">Grandmaster</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="bg-card rounded-lg h-72 animate-pulse border border-gray-800"></div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center">
          <ShieldAlert size={48} className="mb-4 text-gray-700" />
          <p>No accounts found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <Link href={`/account/${listing.id}`} key={listing.id}>
              <div className="bg-card border border-gray-800 hover:border-neon-blue/50 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] group cursor-pointer">
                <div className="h-48 w-full overflow-hidden relative bg-gray-900">
                  <img src={listing.images[0] || '/placeholder.jpg'} alt="Account" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 bg-dark/80 backdrop-blur border border-neon-purple text-neon-purple text-xs font-bold px-2 py-1 rounded">
                    {listing.rank}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white truncate">{listing.title}</h3>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>Heroes: <b className="text-gray-200">{listing.heroesCount}</b></span>
                    <span>Skins: <b className="text-gray-200">{listing.skinsCount}</b></span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-black text-neon-blue">${listing.price}</span>
                    <span className="text-xs bg-neon-blue/10 text-neon-blue px-2 py-1 rounded">View Details</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
