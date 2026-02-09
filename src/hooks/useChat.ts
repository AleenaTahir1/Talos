import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Message } from '../types';

export function useChat(conversationId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load messages when conversation changes
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {
            setIsLoading(true);
            try {
                const history = await invoke<Message[]>('get_messages', { conversationId });
                // Ensure timestamps are Date objects if they come as strings
                const processedHistory = history.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.created_at || new Date()) // Fallback if created_at is missing from DB struct mapping
                    // Note: Rust struct has created_at as string, so we parse it.
                }));
                // Sort by timestamp if needed, but DB query does "ORDER BY created_at ASC"
                setMessages(processedHistory);
                setError(null);
            } catch (err) {
                console.error('Failed to load messages:', err);
                setError(String(err));
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [conversationId]);

    const sendMessage = useCallback(
        async (content: string, model: string) => {
            if (!conversationId) {
                setError("No conversation selected");
                return;
            }

            const tempId = crypto.randomUUID();
            const userMessage: Message = {
                id: tempId,
                role: 'user',
                content,
                timestamp: new Date(),
            };

            // Optimistic update
            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);
            setError(null);

            try {
                // Call Rust backend which saves to DB and returns AI response
                const responseContent = await invoke<string>('send_chat_message', {
                    conversationId,
                    content,
                    model,
                });

                const aiMessage: Message = {
                    id: crypto.randomUUID(), // DB generates ID, but we need one for UI key
                    role: 'assistant',
                    content: responseContent,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);

                // Optional: Reload messages to get true IDs and timestamps from DB?
                // For now, optimistic is fine.
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                // Remove failed message? Or mark as error?
                // For simplicity, we keep it but show error.
            } finally {
                setIsLoading(false);
            }
        },
        [conversationId]
    );

    const updateMessage = useCallback(
        async (messageId: string, newContent: string) => {
            if (!conversationId) return;

            // Optimistic update
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, content: newContent } : msg
                )
            );

            try {
                await invoke('update_message', { messageId, content: newContent });
            } catch (err) {
                console.error('Failed to update message:', err);
                setError(String(err)); // Might want to revert optimistic update here in a real app
            }
        },
        [conversationId]
    );

    const editAndResubmitMessage = useCallback(
        async (messageId: string, newContent: string, model: string) => {
            if (!conversationId) return;

            setIsLoading(true);
            setError(null);

            // 1. Optimistic Update
            setMessages((prev) => {
                const index = prev.findIndex(m => m.id === messageId);
                if (index === -1) return prev;
                const updatedMessages = prev.slice(0, index + 1);
                updatedMessages[index] = { ...updatedMessages[index], content: newContent };
                return updatedMessages;
            });

            try {
                await invoke('update_message', { messageId, content: newContent });
                await invoke('truncate_conversation', { conversationId, afterMessageId: messageId });

                const responseContent = await invoke<string>('regenerate_response', {
                    conversationId,
                    model,
                });

                const aiMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: responseContent,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);

            } catch (err) {
                console.error('Failed to edit and resubmit:', err);
                setError(String(err));
            } finally {
                setIsLoading(false);
            }
        },
        [conversationId]
    );

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        updateMessage,
        editAndResubmitMessage,
        clearMessages,
    };
}

export interface OllamaModel {
    name: string;
    modified_at?: string;
    size?: number;
}

export function useOllama() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [models, setModels] = useState<OllamaModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    const checkStatus = useCallback(async () => {
        try {
            const isConnected = await invoke<boolean>('check_ollama_status');
            setStatus(isConnected ? 'connected' : 'disconnected');

            if (isConnected) {
                const modelList = await invoke<OllamaModel[]>('list_models');
                setModels(modelList);

                // Auto-select first model if none selected
                if (modelList.length > 0 && !selectedModel) {
                    setSelectedModel(modelList[0].name);
                }
            }
        } catch {
            setStatus('disconnected');
        }
    }, [selectedModel]);

    useEffect(() => {
        checkStatus();

        // Poll every 5 seconds
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, [checkStatus]);

    return {
        status,
        models,
        selectedModel,
        setSelectedModel,
        checkStatus,
    };
}
