import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { getArtById, addToCart } from "../services/api"; // Import API function
import { useState, useEffect } from "react";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [art, setArt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [role, setRole] = useState('customer');

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) setRole(storedRole);

        const loadArt = async () => {
            try {
                // Fetch all arts and filter (since we don't have single art endpoint yet)
                const arts = await getArtById(id);
                let foundArt = null;
                const artList = Array.isArray(arts) ? arts : (arts.arts || []);

                // Ensure to compare strings to avoid type issues (ObjectId vs string)
                foundArt = artList.find(a => (String(a._id) === String(id) || String(a.id) === String(id)));

                setArt(foundArt);
            } catch (error) {
                console.error("Error fetching art details", error);
            } finally {
                setLoading(false);
            }
        }
        loadArt();
    }, [id]);

    const handleAddToCart = async () => {
        if (!art) return;
        setAdding(true);
        try {
            await addToCart(art._id || art.id, 1);
            alert("Added to cart!");
            navigate('/cart');
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert("Failed to add to cart (Ensure you are logged in)");
        } finally {
            setAdding(false);
        }
    };

    // Helper to format image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/600x400?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        // Replace backslashes with forward slashes for Windows paths
        const cleanPath = imagePath.replace(/\\/g, '/');
        // If path doesn't start with /, add it. Assuming backend serves at root or proxied /uploads
        // Actually, if cleanPath includes 'uploads/', we want to ensure it matches the proxy.
        // If cleanPath is 'uploads/file.png', and we are at localhost:5173, then /uploads/file.png works.
        return `/${cleanPath}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-brand-bg">Loading details...</div>;

    if (!art) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-brand-bg">Art not found</div>;
    }

    return (
        <div className="min-h-screen bg-brand-bg text-white">
            <Navbar role={role} setRole={setRole} />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" size={20} /> Back to Gallery
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 group">
                        <img
                            src={art.images && art.images.length > 0 ? getImageUrl(art.images[0].url) : 'https://placehold.co/600x400?text=No+Image'}
                            alt={art.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-text to-brand-accent mb-2">
                                {art.title}
                            </h1>
                            <p className="text-xl text-gray-400 font-medium">by {art.artist?.name || 'Unknown Artist'}</p>
                        </div>

                        <div className="bg-brand-dark rounded-xl p-6 border border-white/10">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {art.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-white">${art.price}</span>
                            <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">Available</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="flex-1 bg-brand-accent text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors disabled:opacity-50"
                            >
                                <ShoppingCart size={20} /> {adding ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <button className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-900/30">
                                <MessageCircle size={20} /> Connect with Artist
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;
