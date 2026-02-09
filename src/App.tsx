import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeContext";
import { Logo } from "./components/Logo";
import { SettingsModal } from "./components/SettingsModal";
import { MessageBubble, TypingIndicator } from "./components/MessageBubble";
import { ModelSelector } from "./components/ModelSelector";
import { TitleBar } from "./components/TitleBar";
import { useChat, useOllama } from "./hooks/useChat";
import { useConversations } from "./hooks/useConversations";
import { Trash2, MessageSquare, Plus } from "lucide-react";

function AppContent() {
  const { currentTheme, themeName } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ollama & Persistence
  const { status, models, selectedModel, setSelectedModel } = useOllama();
  const {
    conversations,
    createConversation,
    deleteConversation,
    fetchConversations
  } = useConversations();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, isLoading, sendMessage, editAndResubmitMessage } = useChat(selectedConversationId);

  const colors = currentTheme.colors;
  const isRetro = themeName === 'retro';
  const isGlass = themeName === 'glass';
  const isBubbly = themeName === 'bubbly';

  // Auto-select first conversation or create new one on load
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedModel || status !== 'connected') return;
    if (!selectedConversationId) return;

    const messageToSend = message;
    setMessage('');
    await sendMessage(messageToSend, selectedModel);
    // Refresh conversations line in case updated_at changed
    fetchConversations();
  };

  const handleNewChat = async () => {
    try {
      const id = await createConversation("New Chat", selectedModel || "llama3");
      setSelectedConversationId(id);
    } catch (e) {
      console.error("Failed to create chat", e);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      await deleteConversation(id);
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Styles
  const pixelBorder = isRetro ? {
    boxShadow: 'inset -4px -4px #1a1a1a, inset 4px 4px #4a5568',
  } : {};

  const glassEffect = isGlass ? {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.border}`,
  } : {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: colors.bgPrimary,
      color: colors.textPrimary,
      overflow: 'hidden',
      fontFamily: currentTheme.fontFamily,
      transition: 'all 0.3s ease',
    }}>
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Background Effects */}
        {isGlass && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <div style={{
              position: 'absolute', inset: '-100%', width: '300%', height: '300%',
              backgroundImage: `
              linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
              animation: 'gridMove 20s linear infinite',
            }} />
            <style>{`@keyframes gridMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); } 100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); } }`}</style>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #050510 90%)' }} />
          </div>
        )}

        {currentTheme.name === 'minimal' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, rgba(162, 155, 254, 0.2) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            <motion.div
              animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(253, 121, 168, 0.15) 0%, transparent 70%)',
                filter: 'blur(80px)',
              }}
            />
          </div>
        )}

        {/* Sidebar */}
        <aside style={{
          width: isRetro ? '220px' : '260px',
          backgroundColor: colors.bgSecondary,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          ...glassEffect,
          ...pixelBorder,
        }}>
          {/* Logo/Header */}
          <div style={{
            padding: isRetro ? '12px' : '16px',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo size={isRetro ? 28 : 36} />
              <h1 style={{
                fontSize: isRetro ? '12px' : '20px',
                fontWeight: '600',
                letterSpacing: isRetro ? '0' : '-0.025em',
                margin: 0,
              }}>
                {isRetro ? 'TALOS' : 'Talos'}
              </h1>
            </div>
          </div>

          {/* New Chat Button */}
          <div style={{ padding: '12px' }}>
            <motion.button
              whileHover={{ scale: isRetro ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewChat}
              style={{
                width: '100%',
                padding: isRetro ? '8px 12px' : '12px 16px',
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: currentTheme.borderRadius,
                color: colors.textPrimary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isRetro ? '10px' : '14px',
                fontFamily: 'inherit',
                ...pixelBorder,
              }}
            >
              <Plus size={isRetro ? 12 : 16} />
              {isRetro ? 'NEW CHAT' : 'New Chat'}
            </motion.button>
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <p style={{
              fontSize: isRetro ? '8px' : '12px',
              color: colors.textSecondary,
              padding: '4px 8px',
              textTransform: isRetro ? 'uppercase' : 'none',
              marginBottom: '8px',
            }}>
              {isRetro ? '> HISTORY' : 'History'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {conversations.length === 0 ? (
                <div style={{
                  fontSize: isRetro ? '10px' : '14px',
                  color: colors.textSecondary,
                  padding: '8px',
                  fontStyle: isRetro ? 'normal' : 'italic',
                  textAlign: 'center'
                }}>
                  {isRetro ? '[ EMPTY ]' : 'No conversations yet'}
                </div>
              ) : (
                conversations.map(conv => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ backgroundColor: colors.bgCard }}
                    onClick={() => setSelectedConversationId(conv.id)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: selectedConversationId === conv.id ? colors.accent + '20' : 'transparent',
                      borderRadius: currentTheme.borderRadius,
                      fontSize: isRetro ? '10px' : '14px',
                      color: selectedConversationId === conv.id ? colors.accent : colors.textPrimary,
                      border: selectedConversationId === conv.id ? `1px solid ${colors.accent}40` : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...pixelBorder,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <MessageSquare size={isRetro ? 10 : 14} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.title || 'New Chat'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(e, conv.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.textSecondary,
                        cursor: 'pointer',
                        opacity: 0.6,
                        padding: '4px',
                      }}
                      title="Delete"
                    >
                      <Trash2 size={isRetro ? 10 : 12} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Model Selector */}
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            disabled={status !== 'connected'}
          />

          {/* Bottom Section */}
          <div style={{
            padding: '12px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* Ollama Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isRetro ? '8px' : '14px' }}>
              <motion.div
                animate={status === 'checking' ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  width: isRetro ? '6px' : '8px',
                  height: isRetro ? '6px' : '8px',
                  borderRadius: isRetro ? '0' : '50%',
                  backgroundColor: status === "checking" ? '#eab308' :
                    status === "connected" ? '#22c55e' : '#ef4444'
                }}
              />
              <span style={{ color: colors.textSecondary }}>
                {isRetro
                  ? (status === "checking" ? "CHECKING..." : status === "connected" ? "CONNECTED" : "OFFLINE")
                  : (status === "checking" ? "Checking..." : status === "connected" ? "Ollama Connected" : "Ollama Offline")
                }
              </span>
            </div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ backgroundColor: colors.bgCard }}
              onClick={() => setSettingsOpen(true)}
              style={{
                width: '100%',
                padding: isRetro ? '8px' : '10px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: currentTheme.borderRadius,
                color: colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isRetro ? '10px' : '14px',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isRetro ? '⚙' : '⚙️'}</span>
              {isRetro ? 'SETTINGS' : 'Settings'}
            </motion.button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {selectedConversationId ? (
            <>
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '24px',
              }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: colors.textSecondary }}>
                      <p>{isRetro ? '> START A NEW CONVERSATION' : 'Start a new conversation...'}</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} onEdit={(id, content) => editAndResubmitMessage(id, content, selectedModel)} />
                    ))
                  )}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div style={{
                padding: '16px',
                borderTop: `1px solid ${colors.border}`,
                ...(isGlass && glassEffect),
              }}>
                <div style={{ maxWidth: '768px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <motion.textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isRetro ? '> ENTER MESSAGE...' : isBubbly ? 'Say something nice! 💬' : 'Message Talos...'}
                      whileFocus={{ borderColor: colors.accent }}
                      style={{
                        flex: 1,
                        padding: isRetro ? '10px' : '14px 16px',
                        backgroundColor: colors.bgSecondary,
                        border: `1px solid ${colors.border}`,
                        borderRadius: currentTheme.borderRadius,
                        color: colors.textPrimary,
                        fontSize: isRetro ? '10px' : '15px',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s ease',
                        minHeight: isRetro ? '36px' : '48px',
                        ...pixelBorder,
                      }}
                      rows={1}
                      disabled={status !== "connected" || isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      style={{
                        padding: isRetro ? '10px 14px' : '14px 18px',
                        backgroundColor: (status === "connected" && !isLoading) ? colors.accent : colors.bgCard,
                        border: 'none',
                        borderRadius: currentTheme.borderRadius,
                        color: (status === "connected" && !isLoading) ? '#ffffff' : colors.textSecondary,
                        cursor: (status === "connected" && !isLoading) ? 'pointer' : 'not-allowed',
                        fontSize: isRetro ? '12px' : '16px',
                        fontFamily: 'inherit',
                        ...pixelBorder,
                      }}
                      disabled={status !== "connected" || isLoading}
                    >
                      {isLoading ? (isRetro ? '...' : '⏳') : (isRetro ? '>>' : '➤')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Welcome / Empty Screen */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Logo size={80} />
              <h2 style={{ marginTop: '20px', color: colors.textPrimary }}>Talos AI</h2>
              <p style={{ color: colors.textSecondary }}>Select a chat or create a new one to begin.</p>
              <button
                onClick={handleNewChat}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: colors.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Start New Chat
              </button>
            </div>
          )}
        </main>

        {/* Settings Modal */}
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}

export default AppContent;
