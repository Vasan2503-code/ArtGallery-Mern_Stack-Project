import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import Navbar from "../../components/Navbar";
import { uploadArt } from "../../services/api";

const UploadArt = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "painting" // Default category
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            if (image) {
                data.append("images", image);
            } else {
                setError("Please select an image");
                setLoading(false);
                return;
            }

            await uploadArt(data);
            // Redirect to home or my-arts
            navigate("/");
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to upload art. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-accent/30">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-12">
                <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-brand-accent to-purple-500">
                    Upload New Art
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-brand-dark p-8 rounded-2xl border border-white/10 shadow-xl">
                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Artwork Image</label>
                        <div className={`relative border-2 border-dashed rounded-xl text-center transition-all ${preview ? 'border-brand-accent/50 bg-brand-accent/5' : 'border-gray-700 hover:border-brand-accent/50 hover:bg-white/5'}`}>

                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {preview ? (
                                <div className="relative p-2">
                                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setImage(null); setPreview(null); }}
                                        className="absolute top-4 right-4 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 z-20"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-10 flex flex-col items-center justify-center">
                                    <Upload size={48} className="text-gray-500 mb-4" />
                                    <p className="text-gray-300 font-medium">Drag and drop or click to upload</p>
                                    <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                            placeholder="e.g. Sunset in Venice"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                            placeholder="Tell the story behind your art..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                            >
                                <option value="painting">Painting</option>
                                <option value="sketch">Sketch</option>
                                <option value="digital">Digital Art</option>
                                <option value="photography">Photography</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-brand-accent hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Uploading...' : 'Upload Masterpiece'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default UploadArt;
