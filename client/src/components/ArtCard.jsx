import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ArtCard = ({ art }) => {
    return (
        <div className="group relative bg-brand-dark border border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-accent/10 transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-4/5 overflow-hidden">
                <img
                    // Check if it's a full URL or a relative path from uploads
                    src={art.images && art.images.length > 0 ? art.images[0].url : 'https://placehold.co/600x400?text=No+Image'}
                    alt={art.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <button className="w-full bg-brand-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                        <ShoppingCart size={20} /> Add to Cart
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{art.title}</h3>
                        <p className="text-gray-400 text-sm">by {art.author}</p>
                    </div>
                    <span className="text-brand-accent font-bold text-lg">
                        ${art.price}
                    </span>
                </div>
                <Link to={`/product/${art._id || art.id}`} className="absolute inset-0 z-10" aria-label={`View details of ${art.title}`} />
            </div>
        </div>
    );
};

export default ArtCard;
