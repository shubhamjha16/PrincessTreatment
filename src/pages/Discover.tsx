import React, { useEffect, useState } from 'react';
import { aiService } from '../services/AIService';
import { CycleService, type CycleConfig } from '../services/CycleService';
import { Heart, Sparkles } from 'lucide-react';
import { useShop, type Product } from '../context/ShopContext';
import { ProductModal } from '../components/ProductModal';
import { auth } from '../firebase';

/* ========== PHASE-SPECIFIC PRODUCT CATALOGS ========== */
/* Each phase has products that match her biological & emotional needs */

const PHASE_PRODUCTS: Record<string, Product[]> = {
    Menstrual: [
        {
            id: 'm1',
            name: "Therapeutic Heating Pad",
            brand: "Cozy Care",
            price: "$35.00",
            image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
            description: "Soothing heat therapy for cramps. 3 temperature settings with auto-shutoff.",
        },
        {
            id: 'm2',
            name: "Dark Chocolate Bites",
            brand: "Guilt-Free",
            price: "$12.00",
            image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80",
            description: "Organic dark chocolate with magnesium. Perfect for those cravings.",
        },
        {
            id: 'm3',
            name: "Herbal Cramp Relief Tea",
            brand: "Moon Cycle",
            price: "$18.00",
            image: "https://images.unsplash.com/photo-1597481499750-3e6b22634e12?w=600&q=80",
            description: "Raspberry leaf & chamomile blend. Nature's pain relief.",
        },
        {
            id: 'm4',
            name: "Cozy Weighted Blanket",
            brand: "Snuggle Co",
            price: "$89.00",
            image: "https://images.unsplash.com/photo-1541336032412-204896a782e4?w=600&q=80",
            description: "15lb weighted blanket for deep pressure therapy. Like a warm hug.",
        },
        {
            id: 'm5',
            name: "Rest & Restore Journal",
            brand: "Aura",
            price: "",
            image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
            description: "Gentle prompt: Your body is doing so much right now. Rest is productive. 💜",
        },
    ],
    Follicular: [
        {
            id: 'f1',
            name: "Energy Boost Smoothie Kit",
            brand: "Green Goddess",
            price: "$28.00",
            image: "https://images.unsplash.com/photo-1638176067000-69c612a0e68e?w=600&q=80",
            description: "Superfood blend for rising energy. Spirulina, maca, and açaí.",
        },
        {
            id: 'f2',
            name: "Yoga Flow Mat",
            brand: "ZenFlex",
            price: "$55.00",
            image: "https://images.unsplash.com/photo-1599447421405-0c325d26dc41?w=600&q=80",
            description: "Non-slip eco mat for your renewed workout energy.",
        },
        {
            id: 'f3',
            name: "Goal Planning Notebook",
            brand: "Dream Big",
            price: "$24.00",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80",
            description: "Your creativity is peaking — capture those ideas!",
        },
        {
            id: 'f4',
            name: "Vitamin B Complex",
            brand: "Wellness Labs",
            price: "$22.00",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
            description: "Fuel your rising energy with essential B vitamins.",
        },
        {
            id: 'f5',
            name: "New Beginnings",
            brand: "Aura",
            price: "",
            image: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=600&q=80",
            description: "Your energy is returning. This is the perfect time to start something new! ✨",
        },
    ],
    Ovulatory: [
        {
            id: 'o1',
            name: "Glow Shimmer Body Oil",
            brand: "Radiance",
            price: "$42.00",
            image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&q=80",
            description: "Golden shimmer oil for your peak confidence days. You're glowing!",
        },
        {
            id: 'o2',
            name: "Bold Red Lipstick",
            brand: "Confidence Color",
            price: "$28.00",
            image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
            description: "Your most magnetic phase deserves a bold statement.",
        },
        {
            id: 'o3',
            name: "Date Night Dress",
            brand: "Chic Boutique",
            price: "$120.00",
            image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
            description: "Stunning silhouette for when you're feeling social and confident.",
        },
        {
            id: 'o4',
            name: "Social Energy Perfume",
            brand: "Aura Scents",
            price: "$65.00",
            image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80",
            description: "Fresh, magnetic scent for your most outgoing days.",
        },
        {
            id: 'o5',
            name: "You're Magnetic Today",
            brand: "Aura",
            price: "",
            image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
            description: "Peak confidence. Pitch ideas, make connections, be bold. The world is ready for you! 👑",
        },
    ],
    Luteal: [
        {
            id: 'l1',
            name: "Magnesium Bath Salts",
            brand: "Calm Co",
            price: "$22.00",
            image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80",
            description: "Relaxing mineral soak to ease pre-period tension and help you sleep.",
        },
        {
            id: 'l2',
            name: "Comfort Food Cookbook",
            brand: "Soul Kitchen",
            price: "$32.00",
            image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80",
            description: "Nourishing recipes for when you need extra comfort.",
        },
        {
            id: 'l3',
            name: "Guided Journal",
            brand: "Inner Peace",
            price: "$28.00",
            image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
            description: "Prompts designed for processing emotions gently.",
        },
        {
            id: 'l4',
            name: "Lavender Sleep Mist",
            brand: "Dreamland",
            price: "$18.00",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
            description: "Calming pillow spray for better sleep during the luteal phase.",
        },
        {
            id: 'l5',
            name: "Be Gentle With Yourself",
            brand: "Aura",
            price: "",
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
            description: "Your energy is waning and that's okay. Turn inward. You deserve rest. 💜",
        },
    ],
};

export const Discover: React.FC = () => {
    const [topics, setTopics] = useState<string[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPhase, setCurrentPhase] = useState<string>('Ovulatory');
    const [phaseProducts, setPhaseProducts] = useState<Product[]>([]);

    const [heartAnim, setHeartAnim] = useState<string | null>(null);
    const { isLiked, toggleLike } = useShop();

    useEffect(() => {
        const loadPhaseData = async () => {
            const user = auth.currentUser;
            let config: CycleConfig | null = null;

            if (user) {
                config = await CycleService.getCycleConfig(user.uid);
            }

            // Use demo config if none exists
            const effectiveConfig = config || {
                lastPeriodDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cycleLength: 28
            };

            const phaseData = CycleService.calculatePhase(effectiveConfig);
            const phaseName = phaseData.phase.name;

            setCurrentPhase(phaseName);
            setPhaseProducts(PHASE_PRODUCTS[phaseName] || PHASE_PRODUCTS.Ovulatory);

            // Get AI-generated topics
            aiService.getDiscoveryTopics(phaseName)
                .then(t => setTopics(t))
                .catch(() => setTopics(['Self Care', 'Wellness']))
                .finally(() => setLoadingTopics(false));
        };

        loadPhaseData();
    }, []);

    const handleDoubleTap = (productId: string) => {
        setHeartAnim(productId);
        setTimeout(() => setHeartAnim(null), 800);
        if (!isLiked(productId)) {
            toggleLike(productId);
        }
    };

    // Phase-specific colors and messaging
    const phaseConfig: Record<string, { color: string; emoji: string; message: string }> = {
        Menstrual: { color: 'var(--color-status-error)', emoji: '🩸', message: 'Comfort & rest for your body' },
        Follicular: { color: 'var(--color-status-success)', emoji: '🌱', message: 'Energy & fresh starts' },
        Ovulatory: { color: 'var(--color-accent-gold)', emoji: '✨', message: 'Confidence & connection' },
        Luteal: { color: 'var(--color-primary-deep)', emoji: '🌙', message: 'Calm & self-care' },
    };

    const config = phaseConfig[currentPhase] || phaseConfig.Ovulatory;

    return (
        <div className="discover-container fade-in">
            {/* Phase-Aware Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={20} color={config.color} />
                    <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-deep)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                        Discover
                    </h2>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
                    {loadingTopics ? `Curating for ${currentPhase}...` : (
                        <>
                            {config.emoji} Curated for your <span style={{ color: config.color, fontWeight: 600 }}>{currentPhase} Phase</span>
                        </>
                    )}
                </p>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    {config.message}
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

            {/* Masonry Grid with Phase Products */}
            <div className="masonry-grid">
                {phaseProducts.map(post => {
                    const liked = isLiked(post.id);
                    const isInspiration = !post.price; // Content posts have no price

                    return (
                        <div
                            key={post.id}
                            className={`masonry-item ${isInspiration ? 'inspiration-card' : ''}`}
                            onClick={() => setSelectedProduct(post)}
                            style={isInspiration ? { background: `linear-gradient(135deg, ${config.color}15, ${config.color}05)` } : {}}
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

                                {heartAnim === post.id && (
                                    <div className="heart-animation-overlay" style={{ animation: 'heartPop 0.8s ease-out forwards' }}>
                                        <Heart size={80} fill="white" color="white" />
                                    </div>
                                )}

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
                                            <button className="pin-btn btn-shop">Shop</button>
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

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
