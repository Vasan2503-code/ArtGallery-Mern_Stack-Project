import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Palette, LogIn, UserPlus, Upload, LogOut } from "lucide-react";

const Navbar = () => { // Removed props, reading from local storage for current session
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Simple stat read (in real app use Context)
    const role = localStorage.getItem("role") || 'guest';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    }

    return (
        <nav className="fixed w-full z-50 bg-brand-dark/95 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-linear  -to-r from-brand-accent to-purple-600">
                            ArtGallery
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>



                            {role === 'artist' && (
                                <>
                                    <Link to="/upload-art" className="hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                        <Upload size={18} /> Upload Art
                                    </Link>
                                    <Link to="/my-arts" className="hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                        <Palette size={18} /> My Arts
                                    </Link>
                                </>
                            )}

                            {role === 'guest' ? (
                                <>
                                    <Link to="/login" className="bg-brand-accent hover:bg-pink-600 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                                        <LogIn size={16} /> Login
                                    </Link>
                                    <Link to="/signup" className="border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                                        <UserPlus size={16} /> Signup
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/cart" className="hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                        <ShoppingBag size={18} /> Cart
                                    </Link>
                                    <button onClick={handleLogout} className="hover:bg-red-500/20 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>



                        {role === 'artist' && (
                            <>
                                <Link to="/upload-art" className="text-gray-300 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
                                    <Upload size={18} /> Upload Art
                                </Link>
                                <Link to="/my-arts" className="text-gray-300 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
                                    <Palette size={18} /> My Arts
                                </Link>
                            </>
                        )}

                        {role === 'guest' ? (
                            <div className="flex flex-col gap-2 mt-4">
                                <Link to="/login" className="bg-blue-600 text-center py-2 rounded-lg">Login</Link>
                                <Link to="/signup" className="border border-white/20 text-center py-2 rounded-lg">Signup</Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/cart" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium items-center gap-2">
                                    <ShoppingBag size={18} /> Cart
                                </Link>
                                <button onClick={handleLogout} className="text-left w-full text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-md text-base font-medium items-center gap-2">
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
