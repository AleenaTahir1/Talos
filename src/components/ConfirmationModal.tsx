import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
    const { currentTheme } = useTheme();
    const colors = currentTheme.colors;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: colors.bgSecondary,
                        border: `1px solid ${colors.border}`,
                        borderRadius: currentTheme.borderRadius,
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                        }}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 style={{ margin: 0, color: colors.textPrimary, fontSize: '18px' }}>{title}</h3>
                    </div>

                    <p style={{ margin: '0 0 24px 0', color: colors.textSecondary, lineHeight: '1.5' }}>
                        {message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: `1px solid ${colors.border}`,
                                borderRadius: currentTheme.borderRadius,
                                color: colors.textPrimary,
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ef4444',
                                border: 'none',
                                borderRadius: currentTheme.borderRadius,
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
