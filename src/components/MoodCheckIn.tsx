import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_OPTIONS = [
    { emoji: '😊', label: 'Happy', color: '#4ade80' },
    { emoji: '😌', label: 'Calm', color: '#60a5fa' },
    { emoji: '😔', label: 'Sad', color: '#94a3b8' },
    { emoji: '😤', label: 'Irritated', color: '#f87171' },
    { emoji: '😢', label: 'Overwhelmed', color: '#a78bfa' },
    { emoji: '🥱', label: 'Tired', color: '#fbbf24' },
];

interface MoodCheckInProps {
    onComplete: (mood: string) => void;
    onDismiss: () => void;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onComplete, onDismiss }) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        // Show follow-up for negative moods
        if (['Sad', 'Irritated', 'Overwhelmed'].includes(mood)) {
            setShowFollowUp(true);
        } else {
            onComplete(mood);
        }
    };

    return (
        <motion.div
            className="mood-checkin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="mood-checkin-card glass-panel"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <button className="dismiss-btn" onClick={onDismiss}>×</button>

                <AnimatePresence mode="wait">
                    {!showFollowUp ? (
                        <motion.div key="moods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h3>Good morning, love 💜</h3>
                            <p>How are you feeling right now?</p>

                            <div className="mood-grid">
                                {MOOD_OPTIONS.map(mood => (
                                    <motion.button
                                        key={mood.label}
                                        className="mood-btn"
                                        onClick={() => handleMoodSelect(mood.label)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="mood-emoji">{mood.emoji}</span>
                                        <span className="mood-label">{mood.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="followup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h3>I'm here for you 💜</h3>
                            <p>It's okay to not feel okay. Would you like to...</p>

                            <div className="followup-options">
                                <button
                                    className="followup-btn"
                                    onClick={() => {
                                        onComplete(selectedMood || 'Sad');
                                        // Could navigate to chat here
                                    }}
                                >
                                    💬 Talk to Aura
                                </button>
                                <button
                                    className="followup-btn"
                                    onClick={() => onComplete(selectedMood || 'Sad')}
                                >
                                    📝 Write in journal
                                </button>
                                <button
                                    className="followup-btn secondary"
                                    onClick={() => onComplete(selectedMood || 'Sad')}
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
