import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { motion } from 'framer-motion';

export const Layout: React.FC = () => {
    return (
        <div className="app-container">
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Outlet />
            </motion.main>
            <Navigation />
        </div>
    );
};
