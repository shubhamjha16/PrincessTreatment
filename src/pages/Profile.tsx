import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';

export const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error(error);
            alert("Login Failed");
        }
    };

    const handleLogout = () => signOut(auth);

    if (user) {
        return (
            <div className="dashboard-container fade-in">
                <header className="dashboard-header">
                    <h2 className="greeting">Your Profile</h2>
                </header>

                <div className="hero-card glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%' }} />
                    ) : (
                        <div className="card-icon" style={{ width: 80, height: 80, fontSize: '2rem' }}><User /></div>
                    )}
                    <h3>{user.displayName}</h3>
                    <p className="subtitle">{user.email}</p>

                    <button onClick={handleLogout} className="action-btn-order" style={{ background: 'var(--color-status-error)', marginTop: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LogOut size={16} /> Sign Out</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>
            <div className="auth-modal">
                <h2>Welcome to Aura</h2>
                <p className="auth-subtitle">Your empathetic cycle companion.</p>

                <button onClick={handleLogin} className="google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Continue with Google
                </button>

                <div className="divider"><span>or</span></div>

                <div className="input-group">
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input-group">
                    <input type="password" placeholder="Password" />
                </div>
                <button className="cta-btn">Sign In</button>
            </div>
        </div>
    );
};
