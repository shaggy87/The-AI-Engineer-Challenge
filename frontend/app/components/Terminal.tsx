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
  onUploadPDF: (file: File, apiKey: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isProcessingPDF: boolean;
  pdfUploaded: boolean;
  pdfName: string | null;
  suggestedQuestions: string[];
  followUpQuestions: string[];
  showInitialQuestions: boolean;
}

export default function Terminal({
  onSendMessage,
  onUploadPDF,
  messages,
  isLoading,
  isProcessingPDF,
  pdfUploaded,
  pdfName,
  suggestedQuestions,
  followUpQuestions,
  showInitialQuestions
}: TerminalProps) {
  const [userMessage, setUserMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyForm, setShowApiKeyForm] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showErrorNotification = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000); // Hide after 5 seconds
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    if (!apiKey.trim()) {
      showErrorNotification('⚠️ Please enter your OpenAI API key first');
      setShowApiKeyForm(true);
      return;
    }
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
      if (!apiKey.startsWith('sk-')) {
        showErrorNotification('⚠️ Invalid API key format. OpenAI keys start with "sk-"');
        return;
      }
      setShowApiKeyForm(false);
    } else {
      showErrorNotification('⚠️ Please enter a valid OpenAI API key');
    }
  };

  const handleApiKeyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApiKeySubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select an online casino compliance document (PDF file).');
    }
  };

  const handlePDFUpload = () => {
    if (!apiKey.trim()) {
      showErrorNotification('⚠️ Please enter your OpenAI API key first');
      setShowApiKeyForm(true);
      return;
    }
    if (selectedFile && apiKey.trim()) {
      onUploadPDF(selectedFile, apiKey);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleQuestionClick = (question: string) => {
    // Auto-send the question
    if (!apiKey.trim()) {
      showErrorNotification('⚠️ Please enter your OpenAI API key first');
      setShowApiKeyForm(true);
      return;
    }
    setUserMessage(''); // Clear the input field immediately
    onSendMessage(question, apiKey);
  };

  return (
    <div className="terminal-container">
      {/* Error Notification */}
      {showError && (
        <div className="error-notification">
          <div className="error-content">
            <span className="error-icon">🚨</span>
            <span className="error-text">{errorMessage}</span>
            <button
              className="error-close"
              onClick={() => setShowError(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Background particles */}
      <div className="particles">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="header">
        <div className="header-title">ONLINE CASINO GAMES COMPLIANCE ASSISTANT</div>
        <div className="header-subtitle">
          Upload regulatory documents and get instant online casino compliance guidance
        </div>
        {!showApiKeyForm && (
          <div className="header-controls">
            <button
              className="api-key-button"
              onClick={() => setShowApiKeyForm(true)}
            >
              ⚙️ API Key
            </button>
            {pdfUploaded && (
              <div className="document-status">
                📋 {pdfName} - Ready for queries
              </div>
            )}
          </div>
        )}
      </div>

      {/* Welcome & API Key Screen */}
      {showApiKeyForm && (
        <div className="welcome-overlay">
          <div className="welcome-container">
            <div className="welcome-content">
              <div className="welcome-hero">
                <div className="hero-icon">📋</div>
                <h1 className="hero-title">Online Casino Games Compliance Assistant</h1>
                <p className="hero-subtitle">
                  Your AI-powered compliance consultant for online casino gaming regulations
                </p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3>Document Analysis</h3>
                  <p>Upload online casino regulatory documents from any jurisdiction (UKGC, MGA, etc.) for instant analysis</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💬</div>
                  <h3>Expert Consultation</h3>
                  <p>Ask questions about online casino compliance requirements and get detailed, actionable guidance</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Instant Answers</h3>
                  <p>Get immediate responses about RTP requirements, casino licensing, and online gaming obligations</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h3>Accurate Results</h3>
                  <p>AI analyzes your casino compliance documents to provide precise, context-aware advice</p>
                </div>
              </div>

              <div className="api-key-section">
                <div className="api-key-header">
                  <div className="api-key-title">🔑 Get Started</div>
                  <div className="api-key-subtitle">
                    Enter your OpenAI API key to begin analyzing online casino compliance documents
                  </div>
                </div>
                <div className="api-key-input-container">
                  <input
                    type="password"
                    className="api-key-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-...your OpenAI API key"
                    onKeyDown={handleApiKeyKeyPress}
                    autoFocus
                  />
                  <button
                    className="api-key-submit"
                    onClick={handleApiKeySubmit}
                    disabled={!apiKey.trim()}
                  >
                    Start Analyzing →
                  </button>
                </div>
                <div className="api-key-help">
                  <div className="help-item">
                    <span className="help-icon">🔒</span>
                    <span>Your API key is stored locally and never shared</span>
                  </div>
                  <div className="help-item">
                    <span className="help-icon">💡</span>
                    <span>Need an API key? Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Section */}
      {!showApiKeyForm && !pdfUploaded && (
        <div className="upload-section">
          <div className="upload-container">
            <div className="upload-header">
              <h3>📋 Upload Online Casino Compliance Document</h3>
              <p>Upload online casino regulatory documents (UKGC, MGA, etc.) to get instant compliance guidance</p>
            </div>

            <div className="upload-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                style={{ display: 'none' }}
              />

              {!selectedFile ? (
                <div className="dropzone" onClick={handleUploadClick}>
                  <div className="dropzone-content">
                    <div className="file-icon">📁</div>
                    <div className="dropzone-text">
                      <strong>Click to select online casino compliance document</strong>
                      <br />
                      <small>Or drag and drop casino regulatory PDF here</small>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="file-selected">
                  <div className="file-info">
                    <div className="file-icon">📄</div>
                    <div className="file-details">
                      <strong>{selectedFile.name}</strong>
                      <small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                  </div>
                  <div className="upload-actions">
                    <button
                      className="upload-btn"
                      onClick={handlePDFUpload}
                      disabled={isProcessingPDF}
                    >
                      {isProcessingPDF ? '⏳ Processing...' : '📋 Analyze Casino Document'}
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setSelectedFile(null)}
                      disabled={isProcessingPDF}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}

              {isProcessingPDF && (
                <div className="processing">
                  <div className="processing-animation">⏳</div>
                  <div className="processing-text">
                    Processing online casino compliance document and preparing analysis...
                    <br />
                    <small>This may take a few moments</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {!showApiKeyForm && pdfUploaded && (
        <div className="chat-container">
          {/* Suggested Questions Section */}
          {suggestedQuestions.length > 0 && showInitialQuestions && (
            <div className="suggested-questions">
              <div className="suggested-questions-header">
                <h4>💡 Suggested Questions</h4>
                <p>Click on any question to get started:</p>
              </div>
              <div className="questions-grid">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="question-button"
                    onClick={() => handleQuestionClick(question)}
                    disabled={isLoading}
                  >
                    <span className="question-icon">❓</span>
                    <span className="question-text">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-title">Online Casino Document Analysis Ready!</div>
                <div className="welcome-subtitle">
                  Your casino compliance document "{pdfName}" is ready for analysis. Ask about RTP requirements, gaming regulations, casino licensing obligations, and more!
                  <br />
                  <small>The assistant will analyze your document to provide expert online casino compliance guidance.</small>
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
                    ▋ Searching casino compliance document...
                    <br />▋ Analyzing online gaming requirements...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Questions */}
          {followUpQuestions.length > 0 && !isLoading && (
            <div className="followup-questions">
              <div className="followup-questions-header">
                <h5>🔍 Related Questions</h5>
              </div>
              <div className="questions-grid-small">
                {followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="question-button-small"
                    onClick={() => handleQuestionClick(question)}
                    disabled={isLoading}
                  >
                    <span className="question-icon">💭</span>
                    <span className="question-text">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area - Always show when PDF is uploaded and API key is set */}
      {!showApiKeyForm && pdfUploaded && (
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
      )}
    </div>
  );
}