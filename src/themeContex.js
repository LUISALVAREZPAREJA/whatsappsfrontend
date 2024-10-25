// ThemeContext.js
import React, { createContext, useState } from 'react';

// Crea el contexto
export const ThemeContext = createContext();

// Crea un proveedor para el contexto
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
