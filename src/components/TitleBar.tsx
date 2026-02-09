import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export function TitleBar() {
    const { currentTheme, themeName } = useTheme();
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();

    const isRetro = themeName === 'retro';
    const isGlass = themeName === 'glass';
    const isBubbly = themeName === 'bubbly';

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = async () => {
        const maximized = await appWindow.isMaximized();
        if (maximized) {
            await appWindow.unmaximize();
            setIsMaximized(false);
        } else {
            await appWindow.maximize();
            setIsMaximized(true);
        }
    };
    const handleClose = () => appWindow.close();

    // Theme-specific button styles
    const getButtonStyle = (isHover: boolean, isClose: boolean = false) => {
        const baseStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isRetro ? '24px' : '32px',
            height: isRetro ? '24px' : '32px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            borderRadius: isRetro ? '0' : isBubbly ? '8px' : '6px',
        };

        if (isRetro) {
            return {
                ...baseStyle,
                backgroundColor: isHover
                    ? (isClose ? '#e53935' : '#4a4a4a')
                    : '#2a2a2a',
                border: '2px solid #4a4a4a',
                boxShadow: isHover ? 'none' : 'inset -2px -2px #1a1a1a, inset 2px 2px #5a5a5a',
            };
        }

        if (isGlass) {
            return {
                ...baseStyle,
                backgroundColor: isHover
                    ? (isClose ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.15)')
                    : 'transparent',
                backdropFilter: isHover ? 'blur(10px)' : 'none',
            };
        }

        if (isBubbly) {
            return {
                ...baseStyle,
                backgroundColor: isHover
                    ? (isClose ? '#fca5a5' : '#f0e6eb')
                    : 'transparent',
            };
        }

        // Minimal
        return {
            ...baseStyle,
            backgroundColor: isHover
                ? (isClose ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)')
                : 'transparent',
        };
    };

    const iconColor = isRetro ? '#92cc41' : isBubbly ? '#6b6b6b' : currentTheme.colors.textSecondary;
    const iconSize = isRetro ? 12 : 16;

    return (
        <div
            data-tauri-drag-region
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: isRetro ? '32px' : '36px',
                paddingLeft: '12px',
                paddingRight: '4px',
                backgroundColor: isGlass
                    ? 'rgba(10, 10, 15, 0.8)'
                    : currentTheme.colors.bgSecondary,
                borderBottom: `1px solid ${currentTheme.colors.border}`,
                userSelect: 'none',
                ...(isGlass && {
                    backdropFilter: 'blur(20px)',
                }),
                ...(isRetro && {
                    boxShadow: 'inset 0 -2px #1a1a1a',
                }),
            }}
        >
            {/* App Title */}
            <span
                data-tauri-drag-region
                style={{
                    fontSize: isRetro ? '10px' : '13px',
                    fontWeight: '600',
                    color: currentTheme.colors.textSecondary,
                    fontFamily: currentTheme.fontFamily,
                    letterSpacing: isRetro ? '0' : '0.02em',
                }}
            >
                {isRetro ? '> TALOS v1.0' : 'Talos'}
            </span>

            {/* Window Controls */}
            <div style={{ display: 'flex', gap: isRetro ? '4px' : '6px' }}>
                {/* Minimize */}
                <WindowButton
                    icon={<Minus size={iconSize} color={iconColor} strokeWidth={2.5} />}
                    onClick={handleMinimize}
                    getStyle={getButtonStyle}
                    isRetro={isRetro}
                />

                {/* Maximize/Restore */}
                <WindowButton
                    icon={isMaximized
                        ? <Square size={iconSize - 2} color={iconColor} strokeWidth={2.5} />
                        : <Maximize2 size={iconSize} color={iconColor} strokeWidth={2.5} />
                    }
                    onClick={handleMaximize}
                    getStyle={getButtonStyle}
                    isRetro={isRetro}
                />

                {/* Close */}
                <WindowButton
                    icon={<X size={iconSize} color={iconColor} strokeWidth={2.5} />}
                    onClick={handleClose}
                    getStyle={(hover) => getButtonStyle(hover, true)}
                    isClose
                    isRetro={isRetro}
                />
            </div>
        </div>
    );
}

interface WindowButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    getStyle: (isHover: boolean) => React.CSSProperties;
    isClose?: boolean;
    isRetro: boolean;
}

function WindowButton({ icon, onClick, getStyle }: WindowButtonProps) {
    const [isHover, setIsHover] = useState(false);

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
            style={getStyle(isHover)}
        >
            {icon}
        </motion.button>
    );
}
