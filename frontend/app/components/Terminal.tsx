'use client';

import { useState } from 'react';

interface TerminalProps {
  onExecute: (developerMessage: string, userMessage: string, apiKey: string) => void;
  output: string;
  isLoading: boolean;
}

export default function Terminal({ onExecute, output, isLoading }: TerminalProps) {
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant in the Star Wars universe. Respond as if you are C-3PO or another droid.');
  const [userMessage, setUserMessage] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleExecute = () => {
    if (!userMessage.trim() || !apiKey.trim()) return;
    onExecute(developerMessage, userMessage, apiKey);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleExecute();
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
        <div className="terminal-title">GALAXY AI TERMINAL</div>
        <div className="terminal-subtitle">
          Imperial Command Interface v2.4.7 - May the Force be with you
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label className="input-label">System Directive</label>
            <textarea
              className="terminal-input terminal-textarea"
              value={developerMessage}
              onChange={(e) => setDeveloperMessage(e.target.value)}
              placeholder="Enter system directive for the droid..."
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Transmission</label>
            <textarea
              className="terminal-input terminal-textarea"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Enter your message to the AI system..."
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Access Key</label>
            <input
              type="password"
              className="terminal-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key..."
              onKeyDown={handleKeyPress}
            />
          </div>

          <button
            className="execute-button"
            onClick={handleExecute}
            disabled={isLoading || !userMessage.trim() || !apiKey.trim()}
          >
            {isLoading ? 'Transmitting...' : 'Execute Command'}
          </button>
          
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255, 215, 0, 0.7)' }}>
            Press Ctrl+Enter to execute quickly
          </div>
        </div>

        {/* Output Section */}
        <div className="output-section">
          <div className="output-header">
            System Response
            {isLoading && <span className="loading-indicator"> [PROCESSING...]</span>}
          </div>
          <div className="output-content">
            {output || (
              <span style={{ opacity: 0.6 }}>
                Awaiting transmission... The droids are standing by.
                {!isLoading && <span className="typing-cursor" />}
              </span>
            )}
            {isLoading && (
              <div className="loading-indicator">
                ▋ Analyzing quantum flux patterns...
                <br />▋ Consulting the Jedi Archives...
                <br />▋ Channeling the Force...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}