import Navbar from "../components/Navbar";
import { fetchCart, removeFromCart } from "../services/api"; // Import remove function
import { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchCart();
            setCart(data);
        } catch (err) {
            console.error("Failed to load cart", err);
            // If 404, it might just mean empty cart for new user, handle gracefully
            if (err.response && err.response.status === 404) {
                setCart({ items: [] });
            } else {
                setError("Failed to load your cart.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (artId) => {
        if (!confirm("Are you sure you want to remove this item?")) return;
        try {
            await removeFromCart(artId);
            // Optimistically update UI or reload
            loadData();
        } catch (error) {
            console.error("Failed to remove item", error);
            alert("Failed to remove item");
        }
    }

    // Helper to format image URL (same as ProductDetails)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/100x100?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `/${cleanPath}`;
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            // Check if item.art exists (it might be null if art was deleted)
            return total + (item.art ? item.art.price * item.quantity : 0);
        }, 0);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-brand-bg">Loading cart...</div>;

    if (error) return <div className="min-h-screen flex items-center justify-center text-white bg-brand-bg">{error}</div>;

    const items = cart ? cart.items : [];

    return (
        <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-accent/30">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-brand-accent" /> Your Cart
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-brand-dark rounded-2xl border border-white/5">
                        <ShoppingBag size={64} className="mx-auto text-gray-600 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't found your masterpiece yet.</p>
                        <Link to="/" className="inline-flex items-center px-6 py-3 bg-brand-accent text-white font-bold rounded-xl hover:bg-pink-600 transition-colors">
                            Start Exploring <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                item.art && (
                                    <div key={item._id} className="bg-brand-dark p-4 rounded-xl border border-white/5 flex gap-4 items-center group hover:border-brand-accent/30 transition-colors">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                            <img
                                                src={item.art.images && item.art.images.length > 0 ? getImageUrl(item.art.images[0].url) : 'https://placehold.co/100x100?text=No+Image'}
                                                alt={item.art.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{item.art.title}</h3>
                                            <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-brand-accent">${item.art.price * item.quantity}</p>
                                            <button
                                                onClick={() => handleRemove(item.art._id)}
                                                className="text-gray-500 hover:text-red-500 mt-2 p-2 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 sticky top-24">
                                <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>${calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Taxes (Estimated)</span>
                                        <span>$0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-2xl font-bold text-white mb-8 pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span>${calculateTotal()}</span>
                                </div>

                                <button className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-900/20 transform hover:-translate-y-1">
                                    Checkout <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Cart;
