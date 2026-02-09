// Theme definitions with dramatically different visual styles
export type ThemeType = 'retro' | 'bubbly' | 'glass' | 'minimal';
export type IconType = 'gamepad' | 'heart' | 'sparkles' | 'star';

export interface Theme {
    name: ThemeType;
    displayName: string;
    description: string;
    icon: IconType;
    colors: {
        bgPrimary: string;
        bgSecondary: string;
        bgCard: string;
        textPrimary: string;
        textSecondary: string;
        accent: string;
        userBubble: string;
        aiBubble: string;
        border: string;
    };
    fontFamily: string;
    borderRadius: string;
    messageBorderRadius: string;
    usePixelBorders: boolean;
    useGlassEffect: boolean;
    useSoftShadows: boolean;
    useGradients: boolean;
}

// 1. RETRO GAMER - NES.css pixel art style
const retroTheme: Theme = {
    name: 'retro',
    displayName: 'Retro Gamer',
    description: 'Pixel art NES-style nostalgia',
    icon: 'gamepad',
    colors: {
        bgPrimary: '#212529',
        bgSecondary: '#1a1a2e',
        bgCard: '#16213e',
        textPrimary: '#ffffff',
        textSecondary: '#92929e',
        accent: '#209cee',
        userBubble: '#92cc41',
        aiBubble: '#209cee',
        border: '#4a4a4a',
    },
    fontFamily: '"Press Start 2P", monospace',
    borderRadius: '0px',
    messageBorderRadius: '0px',
    usePixelBorders: true,
    useGlassEffect: false,
    useSoftShadows: false,
    useGradients: false,
};

// 2. MODERN BUBBLY - WhatsApp-like soft pastels
const bubblyTheme: Theme = {
    name: 'bubbly',
    displayName: 'Modern Bubbly',
    description: 'Soft pastels & friendly vibes',
    icon: 'heart',
    colors: {
        bgPrimary: '#fef7ff',
        bgSecondary: '#ffffff',
        bgCard: '#fff5f8',
        textPrimary: '#2d2d2d',
        textSecondary: '#6b6b6b',
        accent: '#e879a0',
        userBubble: '#d4f4e2',
        aiBubble: '#fff0d4',
        border: '#f0e6eb',
    },
    fontFamily: '"Nunito", "Comic Neue", sans-serif',
    borderRadius: '24px',
    messageBorderRadius: '20px',
    usePixelBorders: false,
    useGlassEffect: false,
    useSoftShadows: true,
    useGradients: true,
};

// 3. FUTURISTIC GLASS - Cyberpunk Neon
const glassTheme: Theme = {
    name: 'glass',
    displayName: 'Neon Cyberpunk',
    description: 'High-tech glow & scanlines',
    icon: 'sparkles',
    colors: {
        bgPrimary: '#050510',
        bgSecondary: 'rgba(10, 10, 20, 0.8)',
        bgCard: 'rgba(20, 20, 40, 0.6)',
        textPrimary: '#00f2ff',
        textSecondary: '#bc13fe',
        accent: '#00f2ff',
        userBubble: 'rgba(188, 19, 254, 0.2)',
        aiBubble: 'rgba(0, 242, 255, 0.15)',
        border: '#00f2ff',
    },
    fontFamily: '"Rajdhani", "Orbitron", sans-serif',
    borderRadius: '4px',
    messageBorderRadius: '12px',
    usePixelBorders: false,
    useGlassEffect: true,
    useSoftShadows: false,
    useGradients: true,
};

// 4. MINIMAL KAWAII - Ethereal Dream
const minimalTheme: Theme = {
    name: 'minimal',
    displayName: 'Ethereal Dream',
    description: 'Soft gradients & floating vibes',
    icon: 'star',
    colors: {
        bgPrimary: '#f8f9fa',
        bgSecondary: '#ffffff',
        bgCard: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#6c5ce7',
        textSecondary: '#a29bfe',
        accent: '#fd79a8',
        userBubble: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
        aiBubble: '#ffffff',
        border: 'rgba(255, 255, 255, 0.5)',
    },
    fontFamily: '"Quicksand", system-ui, sans-serif',
    borderRadius: '30px',
    messageBorderRadius: '24px',
    usePixelBorders: false,
    useGlassEffect: false,
    useSoftShadows: true,
    useGradients: true,
};

export const themes: Record<ThemeType, Theme> = {
    retro: retroTheme,
    bubbly: bubblyTheme,
    glass: glassTheme,
    minimal: minimalTheme,
};
