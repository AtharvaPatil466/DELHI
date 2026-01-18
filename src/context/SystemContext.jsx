import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
    const [features, setFeatures] = useState({
        nasaFeed: true,
        visionAI: true,
        publicChat: true,
        predictionV4: false,
        emergencyAlert: null // { type: 'GRAP-4', message: '...' }
    });

    const toggleFeature = (key) => {
        setFeatures(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const triggerAlert = (alert) => {
        setFeatures(prev => ({ ...prev, emergencyAlert: alert }));
    };

    const clearAlert = () => {
        setFeatures(prev => ({ ...prev, emergencyAlert: null }));
    };

    return (
        <SystemContext.Provider value={{ features, toggleFeature, triggerAlert, clearAlert }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};
