import { useState, useEffect } from 'react';

// Simple in-memory storage for conversations until backend is connected
// In production, this would use AWS Amplify DataStore or similar

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

class ConversationStorage {
  private static instance: ConversationStorage;
  private conversations: Conversation[] = [];
  private messages: ChatMessage[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): ConversationStorage {
    if (!ConversationStorage.instance) {
      ConversationStorage.instance = new ConversationStorage();
    }
    return ConversationStorage.instance;
  }

  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('conversations');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.conversations = data.conversations || [];
        this.messages = data.messages || [];
      } catch (e) {
        console.error('Failed to load conversations from localStorage:', e);
      }
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('conversations', JSON.stringify({
        conversations: this.conversations,
        messages: this.messages
      }));
    } catch (e) {
      console.error('Failed to save conversations to localStorage:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getUserId(): string {
    // Simple session-based user ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  getConversations(userId: string): Conversation[] {
    return this.conversations
      .filter(conv => conv.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  createConversation(title: string, userId: string): Conversation {
    const conversation: Conversation = {
      id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.conversations.push(conversation);
    this.saveToStorage();
    this.notifyListeners();
    return conversation;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.find(conv => conv.id === id);
  }

  updateConversation(id: string, updates: Partial<Conversation>): void {
    const index = this.conversations.findIndex(conv => conv.id === id);
    if (index !== -1) {
      this.conversations[index] = { 
        ...this.conversations[index], 
        ...updates, 
        updatedAt: new Date() 
      };
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  getMessages(conversationId: string): ChatMessage[] {
    return this.messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  addMessage(conversationId: string, content: string, sender: 'user' | 'assistant'): ChatMessage {
    const message: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      conversationId,
      content,
      sender,
      timestamp: new Date()
    };

    this.messages.push(message);
    
    // Update conversation's updatedAt
    this.updateConversation(conversationId, { updatedAt: new Date() });
    
    this.saveToStorage();
    this.notifyListeners();
    return message;
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = ConversationStorage.getInstance();
  const userId = storage.getUserId();

  useEffect(() => {
    const updateConversations = () => {
      setConversations(storage.getConversations(userId));
      setLoading(false);
    };

    updateConversations();
    const unsubscribe = storage.subscribe(updateConversations);
    
    return unsubscribe;
  }, [userId, storage]);

  const createConversation = (title: string) => {
    return storage.createConversation(title, userId);
  };

  const getConversation = (id: string) => {
    return storage.getConversation(id);
  };

  return {
    conversations,
    loading,
    createConversation,
    getConversation,
    userId
  };
}

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = ConversationStorage.getInstance();

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const updateMessages = () => {
      setMessages(storage.getMessages(conversationId));
      setLoading(false);
    };

    updateMessages();
    const unsubscribe = storage.subscribe(updateMessages);
    
    return unsubscribe;
  }, [conversationId, storage]);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    if (!conversationId) return null;
    return storage.addMessage(conversationId, content, sender);
  };

  return {
    messages,
    loading,
    addMessage
  };
}