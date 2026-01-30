import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Palette, ShoppingBag } from "lucide-react";
import { registerUser } from "../../services/api";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", // Default role
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            console.log("Signup with:", formData);
            const data = await registerUser(formData);
            console.log("Signup success", data);

            // Assuming successful registration redirects to login or automatically logs in
            // For now, redirect to login
            navigate("/login");
        } catch (err) {
            console.error("Signup failed", err);
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-10 left-10 w-96 h-96 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="bg-brand-dark/50 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 my-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-accent to-purple-500 mb-2">
                        Join the Community
                    </h1>
                    <p className="text-gray-400">Start your journey as a collector or artist</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "customer" })}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${formData.role === "customer"
                                    ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-inner"
                                    : "bg-brand-bg border-gray-600 text-gray-400 hover:bg-white/5"
                                    }`}
                            >
                                <div className="bg-violet-500/20 p-2 rounded-full mb-2">
                                    <ShoppingBag className="h-6 w-6 text-violet-400" />
                                </div>
                                <span className="font-medium text-sm">Customer</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "artist" })}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${formData.role === "artist"
                                    ? "bg-pink-600/20 border-pink-500 text-pink-300 shadow-inner"
                                    : "bg-brand-bg border-gray-600 text-gray-400 hover:bg-white/5"
                                    }`}
                            >
                                <div className="bg-pink-500/20 p-2 rounded-full mb-2">
                                    <Palette className="h-6 w-6 text-pink-400" />
                                </div>
                                <span className="font-medium text-sm">Artist</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-accent hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group mt-4"
                    >
                        Create Account
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium hover:underline transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
