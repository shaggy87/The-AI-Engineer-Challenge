'use client';

import { useState } from 'react';
import StarWarsIntro from './components/StarWarsIntro';
import Terminal from './components/Terminal';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIntroComplete = () => {
    setShowTerminal(true);
  };

  const handleExecute = async (developerMessage: string, userMessage: string, apiKey: string) => {
    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
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

      let currentOutput = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        currentOutput += chunk;
        setOutput(currentOutput);
      }

    } catch (error) {
      console.error('Error:', error);
      setOutput(`ERROR: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease check:\n1. Your API key is correct\n2. The backend server is running on port 8000\n3. Your internet connection is stable\n\nMay the Force help you debug this issue.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!showTerminal && <StarWarsIntro onComplete={handleIntroComplete} />}
      {showTerminal && (
        <Terminal
          onExecute={handleExecute}
          output={output}
          isLoading={isLoading}
        />
      )}
    </>
  );
}