export type ThemeType = 'retro' | 'bubbly' | 'glass' | 'minimal';

export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    accent: string;
    accentHover: string;
    userBubble: string;
    aiBubble: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
}

export interface Theme {
    name: ThemeType;
    displayName: string;
    description: string;
    colors: ThemeColors;
    fontFamily: string;
    borderRadius: string;
    usePixelBorders?: boolean;
    useGlassEffect?: boolean;
    useGradients?: boolean;
}

export const themes: Record<ThemeType, Theme> = {
    retro: {
        name: 'retro',
        displayName: 'Retro Gamer',
        description: 'Pixel art NES-style nostalgia',
        colors: {
            bgPrimary: '#212529',
            bgSecondary: '#2d3238',
            bgCard: '#3a4149',
            accent: '#92cc41',
            accentHover: '#76c442',
            userBubble: '#209cee',
            aiBubble: '#3a4149',
            textPrimary: '#ffffff',
            textSecondary: '#adafb2',
            border: '#4a5568',
        },
        fontFamily: '"Press Start 2P", cursive, monospace',
        borderRadius: '0px',
        usePixelBorders: true,
    },
    bubbly: {
        name: 'bubbly',
        displayName: 'Modern Bubbly',
        description: 'Soft pastels & friendly vibes',
        colors: {
            bgPrimary: '#fefefe',
            bgSecondary: '#f8f9fa',
            bgCard: '#ffffff',
            accent: '#ff6b9d',
            accentHover: '#ff5089',
            userBubble: '#a8d8ff',
            aiBubble: '#ffb88c',
            textPrimary: '#2d3436',
            textSecondary: '#636e72',
            border: '#e9ecef',
        },
        fontFamily: '"Nunito", "Quicksand", sans-serif',
        borderRadius: '24px',
    },
    glass: {
        name: 'glass',
        displayName: 'Futuristic Glass',
        description: 'Dark hologram & glowing edges',
        colors: {
            bgPrimary: '#0a0a0f',
            bgSecondary: '#12121a',
            bgCard: 'rgba(255, 255, 255, 0.05)',
            accent: '#00d4ff',
            accentHover: '#00b8e6',
            userBubble: 'rgba(0, 212, 255, 0.15)',
            aiBubble: 'rgba(139, 92, 246, 0.15)',
            textPrimary: '#ffffff',
            textSecondary: '#8b8b9e',
            border: 'rgba(255, 255, 255, 0.1)',
        },
        fontFamily: '"Inter", "SF Pro Display", sans-serif',
        borderRadius: '16px',
        useGlassEffect: true,
        useGradients: true,
    },
    minimal: {
        name: 'minimal',
        displayName: 'Minimal Clean',
        description: 'Simple & distraction-free',
        colors: {
            bgPrimary: '#0f0f0f',
            bgSecondary: '#1a1a1a',
            bgCard: '#2a2a2a',
            accent: '#6366f1',
            accentHover: '#818cf8',
            userBubble: '#3b82f6',
            aiBubble: '#27272a',
            textPrimary: '#ffffff',
            textSecondary: '#a1a1aa',
            border: '#3f3f46',
        },
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        borderRadius: '12px',
    },
};
