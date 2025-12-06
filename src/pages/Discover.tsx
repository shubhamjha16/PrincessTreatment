import React, { useEffect, useState } from 'react';
import { aiService } from '../services/AIService';
import { CYCLE_CONSTANTS } from '../services/CycleService';
import { Heart } from 'lucide-react';
import { useShop, type Product } from '../context/ShopContext';
import { ProductModal } from '../components/ProductModal';

/* Mock Data with richer details for the modal */
const FEED_POSTS: Product[] = [
    {
        id: '1',
        name: "Morning Inspiration",
        brand: "Aura Daily",
        price: "",
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
        description: "Listening to your body is a form of resistance. Take 5 minutes today to just breathe.",
    },
    {
        id: '2',
        name: "Mulberry Silk Sleep Mask",
        brand: "Luna Sleep",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
        description: "100% Organic Mulberry Silk. Blocks out light completely while protecting your delicate eye skin. Essential for deep Luteal phase rest.",
    },
    {
        id: '3',
        name: "Ceremonial Grade Matcha",
        brand: "Green Zen",
        price: "$32.00",
        image: "https://images.unsplash.com/photo-1515814472071-4d632ff9bcb4?w=600&q=80",
        description: "Sourced directly from Kyoto. High in antioxidants and L-theanine for sustained energy without the crash.",
    },
    {
        id: '4',
        name: "Positive Energy Candle",
        brand: "Aura Home",
        price: "$28.00",
        image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80",
        description: "Hand-poured soy wax with notes of jasmine and sandalwood. Set your intention for the day.",
    },
    {
        id: '5',
        name: "Lavender & Magnesium Soak",
        brand: "Self Care Co",
        price: "$18.50",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        description: "Relieve muscle tension and cramps naturally. Deeply relaxing scent for a perfect bedtime ritual.",
    }
];

export const Discover: React.FC = () => {
    const [topics, setTopics] = useState<string[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Interaction State
    const [heartAnim, setHeartAnim] = useState<string | null>(null);

    const { isLiked, toggleLike } = useShop();

    // Hardcoded current day/phase for MVP
    const currentDay = 14;
    const phaseName = CYCLE_CONSTANTS.getCurrentPhase(currentDay).name;

    useEffect(() => {
        aiService.getDiscoveryTopics(phaseName)
            .then(t => setTopics(t))
            .catch(() => setTopics(['Self Care', 'Rest']))
            .finally(() => setLoadingTopics(false));
    }, [phaseName]);

    const handleDoubleTap = (productId: string) => {
        // Trigger animation
        setHeartAnim(productId);
        setTimeout(() => setHeartAnim(null), 800);

        // Toggle like if not already liked (or just always toggle? Insta usually just 'likes' on double tap, doesn't unlike)
        if (!isLiked(productId)) {
            toggleLike(productId);
        }
    };

    return (
        <div className="discover-container fade-in">
            {/* Header Section */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-deep)', fontFamily: 'var(--font-serif)' }}>Discover</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
                    {loadingTopics ? `Curating for ${phaseName}...` : (
                        <>
                            Curated for your <span style={{ color: 'var(--color-primary-main)', fontWeight: 600 }}>{phaseName} Phase</span>
                        </>
                    )}
                </p>
                {!loadingTopics && (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {topics.map(t => (
                            <span key={t} style={{
                                background: 'white',
                                padding: '0.4rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                color: 'var(--color-primary-deep)'
                            }}>
                                #{t}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Masonry Grid */}
            <div className="masonry-grid">
                {FEED_POSTS.map(post => {
                    const liked = isLiked(post.id);
                    return (
                        <div
                            key={post.id}
                            className="masonry-item"
                            onClick={() => setSelectedProduct(post)}
                        >
                            <div className="pin-image-wrapper">
                                <img
                                    src={post.image}
                                    alt={post.name}
                                    className="pin-image"
                                    loading="lazy"
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        handleDoubleTap(post.id);
                                    }}
                                />

                                {/* Heart Animation Overlay */}
                                {heartAnim === post.id && (
                                    <div className="heart-animation-overlay" style={{ animation: 'heartPop 0.8s ease-out forwards' }}>
                                        <Heart size={80} fill="white" color="white" />
                                    </div>
                                )}

                                {/* Normal Overlay */}
                                <div className="pin-overlay">
                                    <div className="pin-actions">
                                        <button
                                            className="pin-btn btn-save"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(post.id);
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Heart size={14} fill={liked ? "red" : "none"} color={liked ? "red" : "black"} />
                                            {liked ? "Saved" : "Save"}
                                        </button>

                                        {post.price && (
                                            <button className="pin-btn btn-shop">View</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pin-content">
                                <div className="pin-title">{post.name}</div>
                                <div className="pin-user">
                                    <span>{post.brand}</span>
                                </div>
                                {post.price && (
                                    <div className="price-tag">{post.price}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
