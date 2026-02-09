import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ThemeType, themes, IconType } from '../themes';
import { Gamepad2, Heart, Sparkles, Star } from 'lucide-react';

// Icon component helper
const ThemeIcon = ({ icon, size = 20, color }: { icon: IconType; size?: number; color?: string }) => {
    const props = { size, color, strokeWidth: 2 };
    switch (icon) {
        case 'gamepad': return <Gamepad2 {...props} />;
        case 'heart': return <Heart {...props} />;
        case 'sparkles': return <Sparkles {...props} />;
        case 'star': return <Star {...props} />;
    }
};

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { currentTheme, themeName, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>(themeName);

    const handleSave = () => {
        setTheme(selectedTheme);
        onClose();
    };

    const themeList = Object.values(themes);
    const isRetro = themeName === 'retro';

    // Preview colors for each theme
    const getPreviewGradient = (theme: typeof themes.retro) => {
        if (theme.name === 'retro') {
            return `linear-gradient(135deg, ${theme.colors.userBubble}, ${theme.colors.aiBubble})`;
        }
        if (theme.name === 'bubbly') {
            return `linear-gradient(135deg, #ffc0cb, #ffb347, #87ceeb)`;
        }
        if (theme.name === 'glass') {
            return `linear-gradient(135deg, #00d4ff, #8b5cf6, #00d4ff)`;
        }
        return `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.userBubble})`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1000,
                        }}
                    />

                    {/* Modal Container - Scrollable */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1001,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            overflow: 'auto',
                        }}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '480px',
                                backgroundColor: currentTheme.colors.bgSecondary,
                                border: isRetro ? '4px solid #4a4a4a' : `1px solid ${currentTheme.colors.border}`,
                                borderRadius: currentTheme.borderRadius,
                                padding: isRetro ? '16px' : '24px',
                                fontFamily: currentTheme.fontFamily,
                                maxHeight: 'calc(100vh - 40px)',
                                overflow: 'auto',
                                ...(currentTheme.useGlassEffect && {
                                    backgroundColor: 'rgba(15, 15, 25, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 0 60px rgba(0, 212, 255, 0.15)',
                                }),
                                ...(currentTheme.usePixelBorders && {
                                    boxShadow: 'inset -4px -4px #1a1a1a, inset 4px 4px #6a6a6a',
                                }),
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px',
                                paddingBottom: '16px',
                                borderBottom: `1px solid ${currentTheme.colors.border}`,
                            }}>
                                <h2 style={{
                                    fontSize: isRetro ? '12px' : '22px',
                                    fontWeight: isRetro ? '400' : '700',
                                    color: currentTheme.colors.textPrimary,
                                    margin: 0,
                                }}>
                                    {isRetro ? '⚙ SETTINGS' : '⚙️ Settings'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: currentTheme.colors.textSecondary,
                                        cursor: 'pointer',
                                        fontSize: isRetro ? '16px' : '28px',
                                        padding: '4px 8px',
                                        lineHeight: 1,
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Theme Selection Label */}
                            <h3 style={{
                                fontSize: isRetro ? '10px' : '13px',
                                fontWeight: '600',
                                color: currentTheme.colors.textSecondary,
                                marginBottom: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>
                                {isRetro ? '> SELECT THEME' : 'Choose Your Theme'}
                            </h3>

                            {/* Theme Cards */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginBottom: '24px',
                            }}>
                                {themeList.map((theme) => (
                                    <motion.button
                                        key={theme.name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedTheme(theme.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: isRetro ? '12px' : '16px',
                                            backgroundColor: selectedTheme === theme.name
                                                ? (currentTheme.useGlassEffect
                                                    ? 'rgba(0, 212, 255, 0.15)'
                                                    : currentTheme.colors.accent + '15')
                                                : currentTheme.colors.bgCard,
                                            border: selectedTheme === theme.name
                                                ? `2px solid ${currentTheme.colors.accent}`
                                                : `1px solid ${currentTheme.colors.border}`,
                                            borderRadius: currentTheme.borderRadius,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s ease',
                                            width: '100%',
                                            ...(theme.name === 'retro' && selectedTheme === theme.name && {
                                                boxShadow: 'inset -2px -2px #1a1a1a, inset 2px 2px #6a6a6a',
                                            }),
                                        }}
                                    >
                                        {/* Theme Icon */}
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: theme.borderRadius || '12px',
                                            background: getPreviewGradient(theme),
                                            flexShrink: 0,
                                            border: theme.name === 'retro'
                                                ? '3px solid #4a4a4a'
                                                : '2px solid rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ...(theme.name === 'glass' && {
                                                boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                                            }),
                                        }}>
                                            <ThemeIcon icon={theme.icon} size={24} color="#fff" />
                                        </div>

                                        {/* Theme Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: isRetro ? '10px' : '16px',
                                                fontWeight: '600',
                                                color: currentTheme.colors.textPrimary,
                                                marginBottom: '4px',
                                            }}>
                                                {theme.displayName}
                                            </div>
                                            <div style={{
                                                fontSize: isRetro ? '8px' : '13px',
                                                color: currentTheme.colors.textSecondary,
                                            }}>
                                                {theme.description}
                                            </div>
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedTheme === theme.name && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: isRetro ? '0' : '50%',
                                                    backgroundColor: currentTheme.colors.accent,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    flexShrink: 0,
                                                }}>
                                                ✓
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                paddingTop: '16px',
                                borderTop: `1px solid ${currentTheme.colors.border}`,
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    style={{
                                        padding: isRetro ? '8px 16px' : '12px 24px',
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${currentTheme.colors.border}`,
                                        borderRadius: currentTheme.borderRadius,
                                        color: currentTheme.colors.textSecondary,
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: isRetro ? '10px' : '14px',
                                    }}
                                >
                                    {isRetro ? 'CANCEL' : 'Cancel'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    style={{
                                        padding: isRetro ? '8px 16px' : '12px 24px',
                                        backgroundColor: currentTheme.colors.accent,
                                        border: 'none',
                                        borderRadius: currentTheme.borderRadius,
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: isRetro ? '10px' : '14px',
                                        fontWeight: '600',
                                        ...(currentTheme.usePixelBorders && {
                                            boxShadow: 'inset -2px -2px #1a6aa8, inset 2px 2px #4ac8ff',
                                        }),
                                    }}
                                >
                                    {isRetro ? '> APPLY' : 'Apply Theme'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
