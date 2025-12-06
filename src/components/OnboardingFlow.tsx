import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, Heart, Sparkles } from 'lucide-react';
import { CycleService } from '../services/CycleService';
import { auth } from '../firebase';

interface OnboardingData {
    lastPeriodDate: string;
    cycleLength: number;
    periodLength: number;
    symptoms: string[];
    goals: string[];
}

const SYMPTOM_OPTIONS = ['Cramps', 'Bloating', 'Headaches', 'Mood swings', 'Fatigue', 'Acne', 'Back pain'];
const GOAL_OPTIONS = ['Track my cycle', 'Manage symptoms', 'Understand my body', 'Self-care reminders', 'Feel less alone'];

interface OnboardingFlowProps {
    onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>({
        lastPeriodDate: '',
        cycleLength: 28,
        periodLength: 5,
        symptoms: [],
        goals: []
    });
    const [saving, setSaving] = useState(false);

    const nextStep = () => setStep(s => s + 1);

    const toggleArrayItem = (arr: string[], item: string) =>
        arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

    const handleComplete = async () => {
        setSaving(true);
        const user = auth.currentUser;
        if (user && data.lastPeriodDate) {
            await CycleService.saveCycleConfig(user.uid, data.lastPeriodDate, data.cycleLength);
            // Could also save symptoms, goals to Firestore here
        }
        setSaving(false);
        onComplete();
    };

    const steps = [
        // Step 0: Welcome
        <motion.div key="welcome" className="onboarding-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="onboarding-icon">
                <Sparkles size={48} color="var(--color-primary-main)" />
            </div>
            <h2>Welcome to Aura</h2>
            <p>Your cycle-aware companion who truly gets you. Let's personalize your experience in just a few steps.</p>
            <button className="cta-btn" onClick={nextStep}>
                Let's Begin <ChevronRight size={18} />
            </button>
        </motion.div>,

        // Step 1: Last Period
        <motion.div key="period" className="onboarding-step" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="onboarding-icon">
                <Calendar size={48} color="var(--color-primary-main)" />
            </div>
            <h2>When did your last period start?</h2>
            <p>This helps me understand where you are in your cycle.</p>
            <input
                type="date"
                className="onboarding-input"
                value={data.lastPeriodDate}
                onChange={e => setData({ ...data, lastPeriodDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
            />
            <button className="cta-btn" onClick={nextStep} disabled={!data.lastPeriodDate}>
                Continue <ChevronRight size={18} />
            </button>
        </motion.div>,

        // Step 2: Cycle Length
        <motion.div key="length" className="onboarding-step" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2>How long is your typical cycle?</h2>
            <p>Most cycles are 21-35 days. Don't worry if it varies!</p>
            <div className="cycle-length-selector">
                <button onClick={() => setData({ ...data, cycleLength: Math.max(21, data.cycleLength - 1) })}>-</button>
                <span className="cycle-length-value">{data.cycleLength} days</span>
                <button onClick={() => setData({ ...data, cycleLength: Math.min(40, data.cycleLength + 1) })}>+</button>
            </div>
            <button className="cta-btn" onClick={nextStep}>
                Continue <ChevronRight size={18} />
            </button>
        </motion.div>,

        // Step 3: Symptoms
        <motion.div key="symptoms" className="onboarding-step" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2>What symptoms do you experience?</h2>
            <p>Select all that apply. I'll help you manage them.</p>
            <div className="chip-grid">
                {SYMPTOM_OPTIONS.map(symptom => (
                    <button
                        key={symptom}
                        className={`chip ${data.symptoms.includes(symptom) ? 'selected' : ''}`}
                        onClick={() => setData({ ...data, symptoms: toggleArrayItem(data.symptoms, symptom) })}
                    >
                        {symptom}
                    </button>
                ))}
            </div>
            <button className="cta-btn" onClick={nextStep}>
                Continue <ChevronRight size={18} />
            </button>
        </motion.div>,

        // Step 4: Goals
        <motion.div key="goals" className="onboarding-step" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="onboarding-icon">
                <Heart size={48} color="var(--color-primary-main)" />
            </div>
            <h2>What do you want from Aura?</h2>
            <p>I'm here to support you however you need.</p>
            <div className="chip-grid">
                {GOAL_OPTIONS.map(goal => (
                    <button
                        key={goal}
                        className={`chip ${data.goals.includes(goal) ? 'selected' : ''}`}
                        onClick={() => setData({ ...data, goals: toggleArrayItem(data.goals, goal) })}
                    >
                        {goal}
                    </button>
                ))}
            </div>
            <button className="cta-btn" onClick={handleComplete} disabled={saving}>
                {saving ? 'Setting up...' : 'Complete Setup'} <Sparkles size={18} />
            </button>
        </motion.div>
    ];

    return (
        <div className="onboarding-container">
            <div className="onboarding-progress">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`} />
                ))}
            </div>
            <AnimatePresence mode="wait">
                {steps[step]}
            </AnimatePresence>
        </div>
    );
};
