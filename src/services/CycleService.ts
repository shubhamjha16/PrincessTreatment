import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CycleConfig {
    lastPeriodDate: string;
    cycleLength: number;
    updatedAt?: string;
}

export interface PhaseInfo {
    name: string;
    days: [number, number];
    color: string;
    mood: string;
    insight: string;
    recommendations: any[];
}

export const CYCLE_CONSTANTS = {
    phases: {
        menstrual: {
            name: "Menstrual",
            days: [1, 5],
            color: "var(--color-primary-main)",
            mood: "Reflective",
            insight: "Rest and recharge. Your body is doing heavy lifting.",
            recommendations: [
                { id: 1, title: "Cozy Weighted Blanket", price: "$65", image: "https://images.unsplash.com/photo-1541336032412-204896a782e4?w=500&q=80", type: "Comfort" },
                { id: 2, title: "Herbal Cycle Tea", price: "$18", image: "https://images.unsplash.com/photo-1597481499750-3e6b22634e12?w=500&q=80", type: "Wellness" },
                { id: 3, title: "Heating Pad", price: "$35", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80", type: "Care" }
            ]
        },
        follicular: {
            name: "Follicular",
            days: [6, 11],
            color: "var(--color-status-success)",
            mood: "Energetic",
            insight: "Great time to start new projects! Creativity is high.",
            recommendations: [
                { id: 4, title: "Yoga Mat & Block", price: "$45", image: "https://images.unsplash.com/photo-1599447421405-0c325d26dc41?w=500&q=80", type: "Fitness" },
                { id: 5, title: "Vitamin C Serum", price: "$30", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=500&q=80", type: "Beauty" }
            ]
        },
        ovulatory: {
            name: "Ovulatory",
            days: [12, 16],
            color: "var(--color-accent-gold)",
            mood: "Confidence",
            insight: "You are magnetic today. Socialize and pitch ideas!",
            recommendations: [
                { id: 6, title: "Date Night Dress", price: "$120", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80", type: "Fashion" },
                { id: 7, title: "Shimmer Body Oil", price: "$40", image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500&q=80", type: "Beauty" },
                { id: 8, title: "Social Planner", price: "$25", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80", type: "Productivity" }
            ]
        },
        luteal: {
            name: "Luteal",
            days: [17, 28],
            color: "var(--color-primary-deep)",
            mood: "Turning Inward",
            insight: "Focus on details. Be gentle with yourself as energy wanes.",
            recommendations: [
                { id: 9, title: "Magnesium Salts", price: "$22", image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&q=80", type: "Wellness" },
                { id: 10, title: "Journal & Pen", price: "$30", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80", type: "Mindfulness" }
            ]
        }
    },
    getCurrentPhase(day: number): PhaseInfo {
        if (day <= 5) return this.phases.menstrual as any;
        if (day <= 11) return this.phases.follicular as any;
        if (day <= 16) return this.phases.ovulatory as any;
        return this.phases.luteal as any;
    }
};

export const CycleService = {
    // Save or Update Cycle Config
    async saveCycleConfig(userId: string, lastPeriodDate: string, cycleLength = 28) {
        try {
            await setDoc(doc(db, "users", userId), {
                cycleConfig: {
                    lastPeriodDate: lastPeriodDate, // ISO String YYYY-MM-DD
                    cycleLength: Number(cycleLength),
                    updatedAt: new Date().toISOString()
                }
            }, { merge: true });
            return true;
        } catch (e) {
            console.error("Error saving cycle config:", e);
            throw e;
        }
    },

    // Get Cycle Config
    async getCycleConfig(userId: string): Promise<CycleConfig | null> {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().cycleConfig) {
                return docSnap.data().cycleConfig as CycleConfig;
            }
            return null;
        } catch (e) {
            console.error("Error fetching cycle config:", e);
            return null;
        }
    },

    // Calculate Current Phase based on config
    calculatePhase(config: CycleConfig | null) {
        if (!config) {
            // Default Simulation if no config
            const day = 14;
            return {
                currentDay: day,
                phase: CYCLE_CONSTANTS.getCurrentPhase(day),
                isPeriodDue: false
            };
        }

        const lastPeriod = new Date(config.lastPeriodDate);
        const today = new Date();

        // Calculate difference in days
        const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Modulo by cycle length to find current day in *current* cycle
        const currentCycleDay = (diffDays % config.cycleLength) || config.cycleLength;

        const phaseInfo = CYCLE_CONSTANTS.getCurrentPhase(currentCycleDay);

        return {
            currentDay: currentCycleDay,
            phase: phaseInfo,
            isPeriodDue: currentCycleDay > (config.cycleLength - 3)
        };
    }
};
