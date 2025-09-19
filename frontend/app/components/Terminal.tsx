'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface TerminalProps {
  onSendMessage: (userMessage: string, apiKey: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function Terminal({ onSendMessage, messages, isLoading }: TerminalProps) {
  const [userMessage, setUserMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyForm, setShowApiKeyForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!userMessage.trim() || !apiKey.trim()) return;
    onSendMessage(userMessage, apiKey);
    setUserMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyForm(false);
    }
  };

  const handleApiKeyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApiKeySubmit();
    }
  };

  return (
    <div className="terminal-container">
      {/* Stars background */}
      <div className="stars">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-title">GALAXY AI CHAT</div>
        <div className="terminal-subtitle">
          Imperial Chat Interface v3.0.1 - Communicate with the Force
        </div>
        {!showApiKeyForm && (
          <button
            className="api-key-button"
            onClick={() => setShowApiKeyForm(true)}
          >
            ⚙️ Change API Key
          </button>
        )}
      </div>

      {/* API Key Form - Prominent when first entering */}
      {showApiKeyForm && (
        <div className="api-key-overlay">
          <div className="api-key-form">
            <div className="api-key-title">🔑 Enter Your OpenAI API Key</div>
            <div className="api-key-subtitle">
              To begin chatting with the AI, please provide your OpenAI API key
            </div>
            <div className="input-group">
              <input
                type="password"
                className="terminal-input api-key-input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-...your OpenAI API key"
                onKeyDown={handleApiKeyKeyPress}
                autoFocus
              />
            </div>
            <button
              className="execute-button"
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim()}
            >
              Submit & Start Chatting
            </button>
            <div className="api-key-help">
              <small>Your API key is stored locally and never sent to our servers</small>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {!showApiKeyForm && (
        <div className="chat-container">
          {/* Messages Area */}
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-title">Welcome to the Galaxy Chat!</div>
                <div className="welcome-subtitle">
                  Start a conversation with your AI assistant. May the Force be with you!
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}-message`}>
                <div className="message-header">
                  <span className="message-sender">
                    {message.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
                  </span>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="message ai-message loading-message">
                <div className="message-header">
                  <span className="message-sender">🤖 AI Assistant</span>
                  <span className="message-time">typing...</span>
                </div>
                <div className="message-content">
                  <div className="loading-indicator">
                    ▋ Consulting the Jedi Archives...
                    <br />▋ Channeling the Force...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="chat-input-area">
              <textarea
                className="chat-input"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                rows={3}
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={isLoading || !userMessage.trim()}
              >
                {isLoading ? '⏳' : '🚀'}
              </button>
            </div>
            <div className="chat-help">
              <small>Press Enter to send • Shift+Enter for new line</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}