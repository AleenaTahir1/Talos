import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Message } from '../types';
import { Copy, Edit2, Check, X, Bot, User, Sparkles, Clock, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
    message: Message;
    onEdit?: (id: string, newContent: string) => void;
}

export function MessageBubble({ message, onEdit }: MessageBubbleProps) {
    const { currentTheme, themeName } = useTheme();
    const isUser = message.role === 'user';

    const isRetro = themeName === 'retro';
    const isBubbly = themeName === 'bubbly';
    const isGlass = themeName === 'glass';

    const [showActions, setShowActions] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            textareaRef.current?.focus();
            textareaRef.current?.style.setProperty('height', 'auto');
            textareaRef.current?.style.setProperty('height', textareaRef.current.scrollHeight + 'px');
        }
    }, [isEditing]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEditStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditContent(message.content);
        setShowActions(false);
    };

    const handleSave = () => {
        if (onEdit && editContent.trim() !== message.content) {
            onEdit(message.id, editContent);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(message.content);
    };

    const ActionButtons = () => (
        <div style={{
            display: showActions && !isEditing ? 'flex' : 'none',
            gap: '4px',
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            left: 'auto',

            backgroundColor: isRetro ? '#fff' : (isGlass ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'),
            padding: '2px 4px',
            borderRadius: isRetro ? '0' : '6px',
            border: isRetro ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)',
            zIndex: 10,
            backdropFilter: 'blur(4px)',
            ...(isRetro && {
                boxShadow: '2px 2px #000',
                bottom: '-20px',
                right: '0',
            })
        }}>
            {!isUser && ( // Copy only for AI
                <button
                    onClick={handleCopy}
                    title="Copy"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isRetro ? '#000' : '#4a5568', display: 'flex' }}
                >
                    {copied ? <Check size={isRetro ? 10 : 12} /> : <Copy size={isRetro ? 10 : 12} />}
                </button>
            )}
            {isUser && onEdit && ( // Edit only for User
                <button
                    onClick={handleEditStart}
                    title="Edit"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isRetro ? '#000' : '#4a5568', display: 'flex' }}
                >
                    <Edit2 size={isRetro ? 10 : 12} />
                </button>
            )}
        </div>
    );

    const renderContent = () => {
        if (isEditing) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', minWidth: '200px' }}>
                    <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => {
                            setEditContent(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: isRetro ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            resize: 'none',
                            outline: 'none',
                            padding: '4px',
                            borderRadius: isRetro ? '0' : '4px',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSave();
                            }
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={handleCancel} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', opacity: 0.7 }}>
                            <X size={14} />
                        </button>
                        <button onClick={handleSave} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
                            <Check size={14} />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className={`markdown-content ${isRetro ? 'retro-markdown' : ''}`} style={{ fontSize: 'inherit' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>
            </div>
        );
    };

    // RETRO GAMER - NES.css style dialog boxes
    if (isRetro) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginBottom: '32px',
                    position: 'relative',
                }}
            >
                <div style={{
                    maxWidth: '80%',
                    position: 'relative',
                }}>
                    <div style={{
                        fontSize: '8px',
                        fontFamily: '"Press Start 2P", monospace',
                        color: isUser ? '#92cc41' : '#209cee',
                        marginBottom: '4px',
                        paddingLeft: '4px',
                    }}>
                        {isUser ? '> YOU' : '> TALOS'}
                    </div>

                    <div
                        className="nes-balloon"
                        style={{
                            backgroundColor: isUser ? '#1a3a1a' : '#1a2a40',
                            color: isUser ? '#92cc41' : '#7ec8e3',
                            padding: '12px 16px',
                            fontSize: '10px',
                            fontFamily: '"Press Start 2P", monospace',
                            lineHeight: '1.8',
                            border: '4px solid',
                            borderColor: isUser ? '#92cc41' : '#209cee',
                            position: 'relative',
                            imageRendering: 'pixelated',
                            boxShadow: 'inset -4px -4px rgba(0,0,0,0.3)',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '-4px',
                            right: '-4px',
                            bottom: '-4px',
                            border: '4px solid transparent',
                            borderTopColor: isUser ? '#6a9a31' : '#1870b0',
                            borderLeftColor: isUser ? '#6a9a31' : '#1870b0',
                            pointerEvents: 'none',
                        }} />

                        {renderContent()}
                    </div>
                    <ActionButtons />
                </div>
            </motion.div>
        );
    }

    // BUBBLY - Soft pastels with icons
    if (isBubbly) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: '10px',
                    marginBottom: '24px',
                    position: 'relative',
                }}
            >
                {!isUser && (
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffb347, #ff6b6b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                        flexShrink: 0,
                    }}>
                        <Bot size={18} />
                    </div>
                )}

                <div style={{
                    maxWidth: '70%',
                    padding: '14px 18px',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    backgroundColor: isUser ? '#d4f4e2' : '#fff0d4',
                    color: '#2d2d2d',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    fontFamily: '"Nunito", sans-serif',
                    boxShadow: isUser
                        ? '0 2px 12px rgba(52, 211, 153, 0.2)'
                        : '0 2px 12px rgba(255, 179, 71, 0.2)',
                    border: isUser
                        ? '2px solid rgba(52, 211, 153, 0.3)'
                        : '2px solid rgba(255, 179, 71, 0.3)',
                }}>
                    {renderContent()}

                    <div style={{
                        fontSize: '11px',
                        color: '#888',
                        marginTop: '6px',
                        textAlign: isUser ? 'right' : 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        gap: '4px',
                    }}>
                        {isUser ? <MessageSquare size={10} /> : <Sparkles size={10} />}
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <ActionButtons />
                </div>

                {isUser && (
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #86e3ce, #34d399)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(52, 211, 153, 0.3)',
                        flexShrink: 0,
                    }}>
                        <User size={18} />
                    </div>
                )}
            </motion.div>
        );
    }

    // GLASS - Futuristic hologram style
    if (isGlass) {
        return (
            <motion.div
                initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginBottom: '24px',
                    position: 'relative',
                }}
            >
                <motion.div
                    animate={{
                        boxShadow: isUser
                            ? ['0 0 15px rgba(139, 92, 246, 0.3)', '0 0 25px rgba(139, 92, 246, 0.5)', '0 0 15px rgba(139, 92, 246, 0.3)']
                            : ['0 0 15px rgba(0, 212, 255, 0.3)', '0 0 25px rgba(0, 212, 255, 0.5)', '0 0 15px rgba(0, 212, 255, 0.3)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        maxWidth: '75%',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        backgroundColor: isUser
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(0, 212, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isUser ? 'rgba(139, 92, 246, 0.4)' : 'rgba(0, 212, 255, 0.4)'}`,
                        color: '#e0e0e0',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        fontFamily: '"Inter", sans-serif',
                        position: 'relative',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: isUser ? 'auto' : '0',
                        right: isUser ? '0' : 'auto',
                        width: '3px',
                        height: '100%',
                        background: isUser
                            ? 'linear-gradient(180deg, #8b5cf6, transparent)'
                            : 'linear-gradient(180deg, #00d4ff, transparent)',
                        borderRadius: '2px',
                    }} />

                    <div style={{
                        fontSize: '11px',
                        color: isUser ? '#a78bfa' : '#00d4ff',
                        marginBottom: '6px',
                        fontWeight: '500',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}>
                        {isUser ? <User size={12} /> : <Bot size={12} />}
                        {isUser ? 'You' : 'Talos'}
                    </div>

                    {renderContent()}
                    <ActionButtons />
                </motion.div>
            </motion.div>
        );
    }

    // MINIMAL KAWAII - Clean and cute
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: '24px',
                position: 'relative',
            }}
        >
            <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isUser
                    ? currentTheme.colors.userBubble
                    : currentTheme.colors.aiBubble,
                color: currentTheme.colors.textPrimary,
                fontSize: '15px',
                lineHeight: '1.5',
                fontFamily: '"Inter", sans-serif',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
            }}>
                {renderContent()}
                <ActionButtons />
            </div>
        </motion.div>
    );
}

// Loading indicator
export function TypingIndicator() {
    const { currentTheme, themeName } = useTheme();
    const isRetro = themeName === 'retro';

    if (isRetro) {
        return (
            <div style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                color: '#209cee',
                padding: '8px 12px',
            }}>
                {'>'} THINKING...
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            gap: '6px',
            padding: '12px 16px',
            backgroundColor: currentTheme.colors.aiBubble,
            borderRadius: '18px 18px 18px 4px',
            width: 'fit-content',
        }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: currentTheme.colors.accent,
                    }}
                />
            ))}
        </div>
    );
}
