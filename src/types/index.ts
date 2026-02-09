export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date | string;
    created_at?: string;
}

export interface Conversation {
    id: string;
    title: string;
    model: string;
    created_at: string;
    updated_at?: string;
}

export interface OllamaModel {
    name: string;
    modified_at?: string;
    size?: number;
}
