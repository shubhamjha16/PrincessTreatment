import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description?: string;
    brand?: string;
}

interface ShopContextType {
    cart: Product[];
    wishlist: string[]; // Store IDs of liked items
    addToCart: (product: Product) => void;
    toggleLike: (productId: string) => void;
    isLiked: (productId: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);

    const addToCart = (product: Product) => {
        setCart(prev => [...prev, product]);
        // In a real app, we'd trigger a toast here
        console.log(`Added ${product.name} to cart`);
    };

    const toggleLike = (productId: string) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const isLiked = (productId: string) => wishlist.includes(productId);

    return (
        <ShopContext.Provider value={{ cart, wishlist, addToCart, toggleLike, isLiked }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) throw new Error("useShop must be used within a ShopProvider");
    return context;
};
