import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArtCard from "../components/ArtCard";
import { fetchPublicArts } from "../services/api";
import { ShoppingBag } from "lucide-react";

const Home = () => {
    const [role, setRole] = useState('guest');
    const [arts, setArts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Read role from local storage to sync with Navbar default
        const storedRole = localStorage.getItem("role");
        if (storedRole) setRole(storedRole);

        const loadArts = async () => {
            try {
                const data = await fetchPublicArts();
                // Check if data is array, if not it might be nested in data.arts or similar
                // Based on standard controllers it often returns { arts: [] } or just []
                if (Array.isArray(data)) {
                    setArts(data);
                } else if (data.arts && Array.isArray(data.arts)) {
                    setArts(data.arts);
                } else {
                    console.log("Unexpected data format", data);
                    setArts([]);
                }
            } catch (error) {
                console.error("Failed to fetch arts", error);
            } finally {
                setLoading(false);
            }
        };
        loadArts();
    }, []);

    return (
        <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-accent/30">
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h2 className="text-5xl font-bold mb-4">
                        Discover <span className="text-brand-accent">Unique Art</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore a curated collection of digital and physical art from independent artists around the world.
                    </p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading masterpieces...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {arts.length > 0 ? (
                            arts.map((art) => (
                                <ArtCard key={art._id || art.id} art={art} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">No art pieces found.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
export default Home;