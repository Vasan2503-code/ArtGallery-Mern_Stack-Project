import Navbar from "../../components/Navbar";
import { fetchMyArts, deleteArt } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Edit2, Plus, AlertCircle } from "lucide-react";

const MyArts = () => {
    const [arts, setArts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Verify role on mount
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== 'artist') {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        loadArts();
    }, []);

    const loadArts = async () => {
        try {
            const data = await fetchMyArts();
            // Handle different potential response structures
            if (Array.isArray(data)) {
                setArts(data);
            } else if (data.arts && Array.isArray(data.arts)) {
                setArts(data.arts);
            } else {
                setArts([]);
            }
        } catch (err) {
            console.error("Failed to load arts", err);
            setError("Failed to load your artworks.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (artId) => {
        if (!confirm("Are you sure you want to delete this artwork? This action cannot be undone.")) return;
        try {
            await deleteArt(artId);
            loadArts(); // Refresh list
        } catch (err) {
            console.error("Failed to delete art", err);
            alert("Failed to delete art.");
        }
    }

    // Helper to format image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/100x100?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        // Ensure leading slash for local paths served statically
        return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-brand-bg">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-accent/30">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-accent to-purple-500">Artist Dashboard</h1>
                        <p className="text-gray-400 mt-1">Manage your portfolio and track your uploads.</p>
                    </div>
                    <Link to="/upload-art" className="bg-brand-accent hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                        <Plus size={20} /> Upload New Art
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {arts.length === 0 ? (
                    <div className="text-center py-20 bg-brand-dark rounded-2xl border border-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-300 mb-2">No artworks yet</h2>
                        <p className="text-gray-500 mb-6">Start building your collection by uploading your first piece.</p>
                        <Link to="/upload-art" className="text-brand-accent hover:text-white font-bold transition-colors">
                            Upload Now &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {arts.map((art) => (
                            <div key={art._id} className="bg-brand-dark rounded-xl overflow-hidden border border-white/5 hover:border-brand-accent/30 transition-all group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={art.images && art.images.length > 0 ? getImageUrl(art.images[0].url) : 'https://placehold.co/400x300?text=No+Image'}
                                        alt={art.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleDelete(art._id)}
                                            className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                                            title="Delete Art"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        {/* Edit functionality would go here (e.g. navigate to /edit-art/:id) */}
                                        {/* <button className="bg-blue-500/80 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110">
                                            <Edit2 size={20} />
                                        </button> */}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold mb-1 truncate">{art.title}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{art.description}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-accent font-bold">${art.price}</span>
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs uppercase tracking-wider">{art.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default MyArts;
