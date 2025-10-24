'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ChatMessage, Conversation } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

export function useChat(userId: string | null) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null
  });

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        conversations: data || [], 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load conversations', 
        loading: false 
      }));
    }
  }, [userId]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        messages: data || [], 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load messages', 
        loading: false 
      }));
    }
  }, []);

  // Start new conversation
  const startNewConversation = useCallback(async () => {
    if (!userId) return null;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: 'שיחה חדשה',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return null;
      }

      setState(prev => ({ 
        ...prev, 
        currentConversation: data, 
        messages: [],
        loading: false 
      }));

      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to create conversation', 
        loading: false 
      }));
      return null;
    }
  }, [userId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!userId || !content.trim()) return false;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get or create conversation
      let conversation = state.currentConversation;
      if (!conversation) {
        conversation = await startNewConversation();
        if (!conversation) return false;
      }

      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          content: content.trim(),
          is_user: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        setState(prev => ({ 
          ...prev, 
          error: userError.message, 
          loading: false 
        }));
        return false;
      }

      // Add user message to state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }));

      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: conversation.id,
          userId: userId
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send message';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON (e.g., HTML error page)
          console.error('Response is not JSON:', await response.text());
          errorMessage = 'Server returned non-JSON response. Please check your configuration.';
        }
        
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          loading: false 
        }));
        return false;
      }

      let aiResponse;
      try {
        aiResponse = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        setState(prev => ({ 
          ...prev, 
          error: 'Invalid response from server. Please check your configuration.', 
          loading: false 
        }));
        return false;
      }

      // Save AI response
      const { data: aiMessage, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          content: aiResponse.response,
          is_user: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (aiError) {
        setState(prev => ({ 
          ...prev, 
          error: aiError.message, 
          loading: false 
        }));
        return false;
      }

      // Add AI message to state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        loading: false
      }));

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to send message', 
        loading: false 
      }));
      return false;
    }
  }, [userId, state.currentConversation, startNewConversation]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId, loadConversations]);

  return {
    ...state,
    loadMessages,
    startNewConversation,
    sendMessage,
    loadConversations
  };
}


