import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplet, Moon, Sparkles } from 'lucide-react';
import { CycleService } from '../services/CycleService';
import { auth } from '../firebase';
import { CalendarModal } from '../components/CalendarModal';

export const Dashboard: React.FC = () => {
    const [phaseData, setPhaseData] = useState<any>(null);
    const [predictions, setPredictions] = useState<any>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const user = auth.currentUser;
            let config = null;
            if (user) {
                config = await CycleService.getCycleConfig(user.uid);
            }
            const data = CycleService.calculatePhase(config);
            const preds = CycleService.getPredictions(config);
            setPhaseData(data);
            setPredictions(preds);
        };
        loadData();
    }, []);

    // Dynamic greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (!phaseData) return <div className="dashboard-container">Loading...</div>;

    const { currentDay, phase } = phaseData;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h2 className="greeting">{getGreeting()}, Princess</h2>
                    <p className="subtitle">Day {currentDay} • {phase.name} Phase</p>
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

            {/* Predictions Banner */}
            {predictions && (
                <motion.div
                    className="predictions-banner glass-panel"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="prediction-item">
                        <Droplet size={18} color="var(--color-status-error)" />
                        <div>
                            <span className="prediction-label">Next Period</span>
                            <span className="prediction-value">
                                {predictions.nextPeriod.daysUntil <= 0
                                    ? "Today!"
                                    : `in ${predictions.nextPeriod.daysUntil} days`}
                            </span>
                        </div>
                    </div>

                    <div className="prediction-item">
                        <Sparkles size={18} color="var(--color-accent-gold)" />
                        <div>
                            <span className="prediction-label">Ovulation</span>
                            <span className="prediction-value">
                                {predictions.ovulation.daysUntil <= 0
                                    ? "Today!"
                                    : `${predictions.ovulation.dateString}`}
                            </span>
                        </div>
                    </div>

                    {predictions.pms.isActive && (
                        <div className="prediction-item pms-active">
                            <Moon size={18} />
                            <span>PMS Window Active 💜</span>
                        </div>
                    )}
                </motion.div>
            )}

            <motion.div
                className="hero-card glass-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="cycle-ring-container">
                    <div className="cycle-ring" style={{ background: `conic-gradient(${phase.color} 0deg ${(currentDay / 28) * 360}deg, rgba(255,255,255,0.3) ${(currentDay / 28) * 360}deg 360deg)` }}>
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
                    onClick={() => alert("Flow logged for today! 🩸")}
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
