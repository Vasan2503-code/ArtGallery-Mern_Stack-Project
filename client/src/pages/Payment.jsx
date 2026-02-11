
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Retrieve state passed from navigation
    const { amount, items, type } = location.state || {};

    useEffect(() => {
        if (!amount || !items) {
            alert("No payment details found. Redirecting to home.");
            navigate('/');
        }
    }, [amount, items, navigate]);

    if (!amount || !items) return null;

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const orderUrl = "http://localhost:4000/payment/order";
            const { data: order } = await axios.post(orderUrl, { amount });

            // 2. Initialize Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SEjQmTvpEq6cds", // Fallback to hardcoded for now if env not set immediately
                amount: order.amount,
                currency: order.currency,
                name: "Art Gallery",
                description: "Purchase of Art",
                image: "https://placehold.co/100x100?text=AG", // Optional logo
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyUrl = "http://localhost:4000/payment/verify";
                        const { data } = await axios.post(verifyUrl, response);
                        alert(data.message);
                        navigate('/'); // Or to a success page
                    } catch (error) {
                        console.error(error);
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: "User Name", // Ideally get from user context
                    email: "user@example.com",
                    contact: ""
                },
                theme: {
                    color: "#D946EF" // Brand accent color
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment initialization failed", error);
            alert("Payment initialization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg text-white">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" size={20} /> Back
                </button>

                <div className="bg-brand-dark rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-6 text-brand-accent">Checkout</h1>

                    <div className="space-y-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-300 border-b border-white/10 pb-2">Order Summary</h2>
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-gray-400">
                                <span>{item.art ? item.art.title : item.title} {item.quantity ? `x ${item.quantity}` : ''}</span>
                                <span>₹{item.art ? item.art.price * item.quantity : item.price}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center text-2xl font-bold text-white pt-4 border-t border-white/10">
                            <span>Total Amount</span>
                            <span>₹{amount}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-brand-accent hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-900/20 transform hover:-translate-y-1 flex justify-center items-center"
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <AlertCircle size={16} /> Secure details processed by Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
