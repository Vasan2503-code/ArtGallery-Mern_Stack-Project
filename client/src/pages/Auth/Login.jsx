import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "../../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await loginUser(email, password);
            console.log("Login success:", data);

            // Store token and role
            localStorage.setItem("token", data.token); // Assuming backend sends token
            localStorage.setItem("role", data.role);   // Assuming backend sends role
            localStorage.setItem("user", JSON.stringify(data.user || {}));

            navigate("/");
            window.location.reload(); // Force refresh to update Navbar state (simple approach)
        } catch (err) {
            console.error("Login failed", err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white relative overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

            <div className="bg-brand-dark/50 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-accent to-purple-500 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">Sign in to access your art collection</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-accent hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Sign In
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
