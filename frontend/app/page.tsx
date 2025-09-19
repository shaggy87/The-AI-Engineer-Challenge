'use client';

import { useState } from 'react';
import StarWarsIntro from './components/StarWarsIntro';
import Terminal from './components/Terminal';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleIntroComplete = () => {
    setShowTerminal(true);
  };

  const handleSendMessage = async (userMessage: string, apiKey: string) => {
    if (!userMessage.trim() || !apiKey.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString() + '_user',
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: 'You are a helpful AI assistant in the Star Wars universe. Respond as if you are C-3PO or another droid.',
          user_message: userMessage,
          api_key: apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const aiMsg: ChatMessage = {
        id: Date.now().toString() + '_ai',
        type: 'ai',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiMsg.content += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsg.id ? { ...msg, content: aiMsg.content } : msg
          )
        );
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMsg: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'ai',
        content: `ERROR: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease check:\n1. Your API key is correct\n2. The backend server is running on port 8000\n3. Your internet connection is stable\n\nMay the Force help you debug this issue.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!showTerminal && <StarWarsIntro onComplete={handleIntroComplete} />}
      {showTerminal && (
        <Terminal
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
        />
      )}
    </>
  );
}