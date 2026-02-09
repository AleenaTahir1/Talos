import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, Theme, themes } from '../themes';

interface ThemeContextType {
    currentTheme: Theme;
    themeName: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'sage-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeType>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved && saved in themes) {
                return saved as ThemeType;
            }
        }
        return 'minimal';
    });

    const setTheme = (theme: ThemeType) => {
        setThemeName(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    };

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }, [themeName]);

    const currentTheme = themes[themeName];

    return (
        <ThemeContext.Provider value={{ currentTheme, themeName, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
