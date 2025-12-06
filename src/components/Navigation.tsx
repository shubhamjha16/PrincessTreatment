import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, ShoppingBag, User } from 'lucide-react';

export const Navigation: React.FC = () => {
    return (
        <nav className="bottom-nav glass-panel">
            <NavLink
                to="/"
                className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            >
                <Home size={24} />
                <span>Today</span>
            </NavLink>

            <NavLink
                to="/chat"
                className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            >
                <MessageCircle size={24} />
                <span>Chat</span>
            </NavLink>

            <NavLink
                to="/discover"
                className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            >
                <ShoppingBag size={24} />
                <span>Shop</span>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            >
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};
