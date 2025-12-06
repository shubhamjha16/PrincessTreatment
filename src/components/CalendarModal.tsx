import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarModalProps {
    onClose: () => void;
    currentDay: number; // Day of cycle 1-28
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ onClose }) => {
    const daysInMonth = 30; // Simplified for MVP
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Simple logic: pretend cycle started on day 1 of month for visual simplicity in MVP
    // or just highlight the current day relative to "today"

    return (
        <div className="auth-modal-overlay active" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Cycle</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <button style={{ background: 'none', border: 'none' }}><ChevronLeft size={20} /></button>
                    <span style={{ fontWeight: 600 }}>December 2024</span>
                    <button style={{ background: 'none', border: 'none' }}><ChevronRight size={20} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{d}</span>)}

                    {/* Offset for start of month (random/fixed for MVP) */}
                    <span></span><span></span>

                    {days.map(day => {
                        // Determine if this 'calendar day' corresponds to a phase
                        // This is a Visual Mockup: Assuming Day 1 of month = Day 1 of Cycle for simplicity in this demo view
                        // In production, this would map real dates

                        let bgColor = 'transparent';
                        let color = 'var(--color-text-primary)';

                        // Visualization logic based on cycle day 
                        // We'll just highlight the 'current day' passed in
                        const isToday = day === 15; // Mocking "Today" as 15th for visual

                        if (isToday) {
                            bgColor = 'var(--color-primary-main)';
                            color = 'white';
                        }

                        // Highlight Period (Days 1-5 of month/cycle)
                        const isPeriod = day <= 5;
                        if (isPeriod) {
                            bgColor = 'rgba(255, 100, 100, 0.15)';
                            color = 'var(--color-status-error)';
                        }

                        return (
                            <div key={day} style={{
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                background: bgColor,
                                color: color,
                                fontWeight: isToday ? 600 : 400,
                                cursor: 'pointer'
                            }}>
                                {day}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-status-error)' }}></span>
                        Period
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent-gold)' }}></span>
                        Ovulation
                    </div>
                </div>
            </div>
        </div>
    );
};
