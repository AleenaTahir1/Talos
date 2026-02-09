import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
    size?: number;
}

export function Logo({ size = 40 }: LogoProps) {
    const { themeName } = useTheme();

    const isRetro = themeName === 'retro';
    const isBubbly = themeName === 'bubbly';
    const isGlass = themeName === 'glass';

    // SVG Paths
    const robotBody = "M30 80 Q30 30 100 30 Q170 30 170 80 Q170 120 130 130 L130 160 L100 130 Q30 130 30 80 Z";
    const eyes = [
        { cx: 70, cy: 80, r: 10 },
        { cx: 100, cy: 80, r: 10 },
        { cx: 130, cy: 80, r: 10 }
    ];
    const mouth = "M60 100 Q100 130 140 100";

    // RETRO - Pixelated
    if (isRetro) {
        return (
            <div style={{
                width: size,
                height: size,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <svg width={size} height={size} viewBox="0 0 200 200" style={{ imageRendering: 'pixelated' }}>
                    <path d={robotBody} fill="#209cee" stroke="#fff" strokeWidth="4" />
                    {eyes.map((eye, i) => (
                        <circle key={i} cx={eye.cx} cy={eye.cy} r={eye.r} fill="#fff" shapeRendering="crispEdges" />
                    ))}
                    <path d={mouth} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="square" />
                </svg>
            </div>
        );
    }

    // BUBBLY - Cute & Bouncy
    if (isBubbly) {
        return (
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: size, height: size }}
            >
                <svg width={size} height={size} viewBox="0 0 200 200">
                    <defs>
                        <linearGradient id="bubblyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff9a9e" />
                            <stop offset="100%" stopColor="#fecfef" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d={robotBody}
                        fill="url(#bubblyGrad)"
                        stroke="#fff"
                        strokeWidth="4"
                        animate={{
                            d: [
                                "M30 80 Q30 30 100 30 Q170 30 170 80 Q170 120 130 130 L130 160 L100 130 Q30 130 30 80 Z",
                                "M32 82 Q32 35 100 35 Q168 35 168 82 Q168 122 130 132 L130 158 L100 132 Q32 132 32 82 Z",
                                "M30 80 Q30 30 100 30 Q170 30 170 80 Q170 120 130 130 L130 160 L100 130 Q30 130 30 80 Z"
                            ]
                        }} // Subtle squash/stretch
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {eyes.map((eye, i) => (
                        <motion.circle
                            key={i}
                            cx={eye.cx}
                            cy={eye.cy}
                            r={eye.r}
                            fill="#fff"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                        />
                    ))}
                    <path d={mouth} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </motion.div>
        );
    }

    // FUTURISTIC GLASS - Hologram & Scanline
    if (isGlass) {
        return (
            <div style={{ width: size, height: size, position: 'relative' }}>
                <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))' }}>
                    <path d={robotBody} fill="none" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.8" />
                    <path d={robotBody} fill="rgba(0, 212, 255, 0.1)" />

                    {eyes.map((eye, i) => (
                        <circle key={i} cx={eye.cx} cy={eye.cy} r={eye.r * 0.8} fill="#00d4ff" fillOpacity="0.8" />
                    ))}
                    <path d={mouth} fill="none" stroke="#00d4ff" strokeWidth="3" />
                </svg>
                {/* Horizontal Scanline */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, height: '2px',
                        background: 'rgba(0, 212, 255, 0.8)',
                        boxShadow: '0 0 10px #00d4ff',
                        zIndex: 10
                    }}
                    animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    // MINIMAL - Sleek & Floating
    return (
        <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="minimalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7aa2f7" />
                        <stop offset="100%" stopColor="#bb9af7" />
                    </linearGradient>
                </defs>
                <path d={robotBody} fill="url(#minimalGrad)" />
                {eyes.map((eye, i) => (
                    <circle key={i} cx={eye.cx} cy={eye.cy} r={eye.r} fill="rgba(255,255,255,0.9)" />
                ))}
                <path d={mouth} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="5" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
}
