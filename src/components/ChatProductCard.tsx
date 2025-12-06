import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { type Product } from '../context/ShopContext';
import { useShop } from '../context/ShopContext';

interface ChatProductCardProps {
    product: Product;
    onViewDetails?: () => void;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onViewDetails }) => {
    const { addToCart, isLiked, toggleLike } = useShop();

    return (
        <motion.div
            className="chat-product-card"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="chat-product-image-wrapper">
                <img src={product.image} alt={product.name} className="chat-product-image" />
                <button
                    className="chat-product-like-btn"
                    onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                >
                    <Heart size={16} fill={isLiked(product.id) ? "#e74c3c" : "none"} color={isLiked(product.id) ? "#e74c3c" : "white"} />
                </button>
            </div>

            <div className="chat-product-info">
                <div className="chat-product-name">{product.name}</div>
                <div className="chat-product-brand">{product.brand}</div>
                {product.price && <div className="chat-product-price">{product.price}</div>}
            </div>

            <div className="chat-product-actions">
                {product.price && (
                    <button
                        className="chat-product-btn primary"
                        onClick={() => addToCart(product)}
                    >
                        <ShoppingBag size={14} /> Add to Cart
                    </button>
                )}
                <button
                    className="chat-product-btn secondary"
                    onClick={onViewDetails}
                >
                    View
                </button>
            </div>
        </motion.div>
    );
};
