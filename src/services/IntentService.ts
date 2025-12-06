/**
 * Intent Detection Service
 * Detects user needs from chat messages and suggests relevant products
 */

import { type Product } from '../context/ShopContext';

// Intent types that trigger product suggestions
export type IntentType = 'craving' | 'pain' | 'tired' | 'anxious' | 'lonely' | 'pms' | 'none';

interface DetectedIntent {
    type: IntentType;
    confidence: number;
    suggestedProducts: Product[];
}

// Intent patterns with keywords
const INTENT_PATTERNS: Record<string, { keywords: string[]; type: IntentType }> = {
    craving: {
        keywords: ['craving', 'want chocolate', 'want sweets', 'hungry', 'comfort food', 'ice cream', 'snack'],
        type: 'craving'
    },
    pain: {
        keywords: ['cramps', 'pain', 'hurts', 'aching', 'sore', 'headache', 'backache', 'period pain'],
        type: 'pain'
    },
    tired: {
        keywords: ['tired', 'exhausted', 'sleepy', 'can\'t sleep', 'insomnia', 'fatigue', 'no energy', 'drained'],
        type: 'tired'
    },
    anxious: {
        keywords: ['anxious', 'worried', 'stress', 'overwhelmed', 'panic', 'nervous', 'can\'t relax'],
        type: 'anxious'
    },
    lonely: {
        keywords: ['lonely', 'alone', 'no one', 'nobody', 'miss someone', 'feel isolated', 'need company'],
        type: 'lonely'
    },
    pms: {
        keywords: ['pms', 'pre period', 'before period', 'about to start', 'period coming'],
        type: 'pms'
    }
};

// Product suggestions mapped to intents
const INTENT_PRODUCTS: Record<IntentType, Product[]> = {
    craving: [
        {
            id: 'intent_c1',
            name: 'Organic Dark Chocolate Bites',
            brand: 'Guilt-Free',
            price: '$12.00',
            image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80',
            description: 'Rich dark chocolate with magnesium. Satisfies cravings while being kind to your body.'
        },
        {
            id: 'intent_c2',
            name: 'Salted Caramel Nuts',
            brand: 'Treat Yo Self',
            price: '$15.00',
            image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80',
            description: 'Sweet, salty, crunchy — the perfect comfort snack.'
        }
    ],
    pain: [
        {
            id: 'intent_p1',
            name: 'Therapeutic Heating Pad',
            brand: 'Cozy Care',
            price: '$35.00',
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80',
            description: 'Instant relief for cramps. 3 heat settings with auto-shutoff.'
        },
        {
            id: 'intent_p2',
            name: 'Herbal Cramp Relief Tea',
            brand: 'Moon Cycle',
            price: '$18.00',
            image: 'https://images.unsplash.com/photo-1597481499750-3e6b22634e12?w=400&q=80',
            description: 'Raspberry leaf & ginger blend. Natural pain relief.'
        }
    ],
    tired: [
        {
            id: 'intent_t1',
            name: 'Lavender Sleep Mist',
            brand: 'Dreamland',
            price: '$18.00',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
            description: 'Calming pillow spray for deeper, more restful sleep.'
        },
        {
            id: 'intent_t2',
            name: 'Energy Boost Vitamin B12',
            brand: 'Wellness Labs',
            price: '$22.00',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
            description: 'Sublingual B12 for natural, sustained energy.'
        }
    ],
    anxious: [
        {
            id: 'intent_a1',
            name: 'Calm Magnesium Powder',
            brand: 'Natural Calm',
            price: '$28.00',
            image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=80',
            description: 'Relaxing drink mix that eases tension and promotes calm.'
        },
        {
            id: 'intent_a2',
            name: 'Anxiety Relief Journal',
            brand: 'Mindful Co',
            price: '$24.00',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80',
            description: 'Guided prompts to process worries and find peace.'
        }
    ],
    lonely: [
        {
            id: 'intent_l1',
            name: 'Self-Love Affirmation Cards',
            brand: 'Inner Light',
            price: '$18.00',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80',
            description: '52 beautiful cards to remind you of your worth.'
        }
    ],
    pms: [
        {
            id: 'intent_pms1',
            name: 'PMS Relief Bundle',
            brand: 'Cycle Care',
            price: '$45.00',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
            description: 'Tea, bath salts, and chocolate — your pre-period survival kit.'
        },
        {
            id: 'intent_pms2',
            name: 'Mood Support Gummies',
            brand: 'Happy Hormones',
            price: '$32.00',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
            description: 'Vitamin B6 + Magnesium to balance your mood naturally.'
        }
    ],
    none: []
};

/**
 * Detect intent from user message
 */
export function detectIntent(message: string): DetectedIntent {
    const lowerMessage = message.toLowerCase();

    for (const [, pattern] of Object.entries(INTENT_PATTERNS)) {
        for (const keyword of pattern.keywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    type: pattern.type,
                    confidence: 0.8,
                    suggestedProducts: INTENT_PRODUCTS[pattern.type] || []
                };
            }
        }
    }

    return {
        type: 'none',
        confidence: 0,
        suggestedProducts: []
    };
}

/**
 * Get contextual care message based on intent
 */
export function getCareSuggestion(intentType: IntentType): string {
    const suggestions: Record<IntentType, string> = {
        craving: "I noticed you're craving something! Here's something that might help 🍫",
        pain: "I'm sorry you're in pain. Here's something that could bring relief 💜",
        tired: "Sounds like you need some rest. Here's something to help you recharge 😴",
        anxious: "I hear you — anxiety is tough. Here's something to help you feel calmer 🌿",
        lonely: "I'm here with you. You're not alone 💜 Here's something to remind you of your worth",
        pms: "PMS can be rough! Here's a care package just for you 🌙",
        none: ""
    };

    return suggestions[intentType] || "";
}
