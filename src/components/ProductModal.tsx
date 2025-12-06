import React from 'react';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop, type Product } from '../context/ShopContext';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const { addToCart, toggleLike, isLiked } = useShop();

    if (!product) return null;

    const liked = isLiked(product.id);

    return (
        <AnimatePresence>
            <div className="auth-modal-overlay active" onClick={onClose} style={{ zIndex: 2000 }}>
                <motion.div
                    className="product-modal-content"
                    onClick={e => e.stopPropagation()}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    <button className="close-btn-float" onClick={onClose}>
                        <X size={24} color="#fff" />
                    </button>

                    <div className="modal-image-container">
                        <img src={product.image} alt={product.name} className="modal-image" />
                        <div className="modal-image-overlay"></div>
                    </div>

                    <div className="modal-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 className="modal-brand">{product.brand || "Aura Selection"}</h3>
                                <h2 className="modal-title">{product.name}</h2>
                            </div>
                            <span className="modal-price">{product.price}</span>
                        </div>

                        <p className="modal-description">
                            {product.description || "Experience premium self-care with this curated essential. Perfect for your current cycle phase, helping you align with your body's natural rhythm."}
                        </p>

                        <div className="modal-actions">
                            <button
                                className={`icon-btn-large ${liked ? 'liked' : ''}`}
                                onClick={() => toggleLike(product.id)}
                            >
                                <Heart size={24} fill={liked ? "currentColor" : "none"} />
                            </button>

                            <button
                                className="cta-btn-large"
                                onClick={() => {
                                    addToCart(product);
                                    onClose(); // Optional: keep open or close
                                    alert("Added to Cart!");
                                }}
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
