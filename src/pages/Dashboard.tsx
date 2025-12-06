import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { CycleService } from '../services/CycleService';
import { auth } from '../firebase';
import { CalendarModal } from '../components/CalendarModal';

export const Dashboard: React.FC = () => {
    const [phaseData, setPhaseData] = useState<any>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const user = auth.currentUser;
            let config = null;
            if (user) {
                config = await CycleService.getCycleConfig(user.uid);
            }
            const data = CycleService.calculatePhase(config);
            setPhaseData(data);
        };
        loadData();
    }, []);

    if (!phaseData) return <div className="dashboard-container">Loading...</div>;

    const { currentDay, phase } = phaseData;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h2 className="greeting">Good Afternoon, Princess</h2>
                    <p className="subtitle">It's a beautiful day to thrive.</p>
                </div>
                <button
                    className="icon-btn"
                    onClick={() => setShowCalendar(true)}
                >
                    <Calendar size={20} />
                </button>
            </header>

            {showCalendar && (
                <CalendarModal
                    currentDay={currentDay}
                    onClose={() => setShowCalendar(false)}
                />
            )}

            <motion.div
                className="hero-card glass-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="cycle-ring-container">
                    <div className="cycle-ring" style={{ background: `conic-gradient(${phase.color} 0deg 180deg, rgba(255,255,255,0.5) 180deg 360deg)` }}>
                        <div className="inner-circle">
                            <span className="day-number">Day {currentDay}</span>
                            <span className="day-label">of Cycle</span>
                        </div>
                    </div>
                </div>

                <div className="phase-info">
                    <h3 style={{ color: phase.color }}>{phase.name} Phase</h3>
                    <p className="phase-desc">{phase.insight}</p>
                </div>
            </motion.div>

            <div className="insight-card glass-panel">
                <div className="card-icon">✨</div>
                <div className="card-content">
                    <h4>Daily Insight</h4>
                    <p>{phase.mood} energy is dominant. {phase.insight}</p>
                </div>
            </div>

            <div className="action-grid">
                <button
                    className="action-card glass-panel"
                    onClick={() => alert("Flow logged for today! 🩸 (Calendar integration coming soon)")}
                >
                    <span className="icon">💧</span>
                    <span>Log Flow</span>
                </button>
                <button
                    className="action-card glass-panel"
                    onClick={() => {
                        const entry = prompt("How are you feeling right now?");
                        if (entry) alert("Journal entry saved! 📝");
                    }}
                >
                    <span className="icon">📝</span>
                    <span>Journal</span>
                </button>
            </div>
        </div>
    );
};
