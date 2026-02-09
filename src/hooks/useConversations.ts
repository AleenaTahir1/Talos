import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Conversation } from '../types';

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await invoke<Conversation[]>('get_conversations');
            setConversations(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError(String(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createConversation = useCallback(async (title: string, model: string) => {
        try {
            const id = await invoke<string>('create_conversation', { title, model });
            await fetchConversations();
            return id;
        } catch (err) {
            console.error('Failed to create conversation:', err);
            throw err;
        }
    }, [fetchConversations]);

    const deleteConversation = useCallback(async (conversationId: string) => {
        try {
            await invoke('delete_conversation', { conversationId });
            setConversations(prev => prev.filter(c => c.id !== conversationId));
        } catch (err) {
            console.error('Failed to delete conversation:', err);
            throw err;
        }
    }, []);

    const renameConversation = useCallback(async (conversationId: string, title: string) => {
        try {
            await invoke('rename_conversation', { conversationId, title });
            await fetchConversations();
        } catch (err) {
            console.error('Failed to rename conversation:', err);
            throw err;
        }
    }, [fetchConversations]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        isLoading,
        error,
        fetchConversations,
        createConversation,
        deleteConversation,
        renameConversation,
    };
}
