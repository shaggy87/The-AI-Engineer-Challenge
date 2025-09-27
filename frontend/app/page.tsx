'use client';

import { useState } from 'react';
import Terminal from './components/Terminal';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);

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
    setShowInitialQuestions(false); // Hide initial questions after first message

    try {
      const endpoint = pdfUploaded ? '/api/pdf-chat' : '/api/chat';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: pdfUploaded
            ? 'You are an expert online casino games compliance consultant. Answer questions based strictly on the provided compliance document. Only use information from the uploaded document to answer questions. If the context doesn\'t contain relevant information, respond with "I don\'t have information about that in the uploaded compliance document."'
            : 'You are an expert online casino games compliance consultant. Help with regulatory requirements, RTP compliance, licensing obligations, gaming regulations, and other aspects of online casino compliance.',
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

      // Generate follow-up questions after response is complete
      if (pdfUploaded && aiMsg.content.trim()) {
        try {
          const followupResponse = await fetch('/api/generate-followup-questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              developer_message: '',
              user_message: userMessage,
              api_key: apiKey,
            }),
          });

          if (followupResponse.ok) {
            const followupResult = await followupResponse.json();
            setFollowUpQuestions(followupResult.questions || []);
          }
        } catch (followupError) {
          console.log('Could not generate follow-up questions:', followupError);
          setFollowUpQuestions([]);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      let errorContent = '';

      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Incorrect API key')) {
          errorContent = `🔑 **Invalid API Key Error**\n\nYour OpenAI API key appears to be incorrect or invalid.\n\n**Please check:**\n1. ✅ Copy your API key exactly from OpenAI Platform\n2. ✅ Make sure it starts with "sk-"\n3. ✅ Verify the key hasn't expired\n4. ✅ Check you have sufficient credits\n\n[Get your API key here](https://platform.openai.com/api-keys)`;
        } else if (error.message.includes('429')) {
          errorContent = `⏰ **Rate Limit Error**\n\nToo many requests to OpenAI API.\n\n**Please:**\n1. Wait a moment and try again\n2. Check your API usage limits\n3. Consider upgrading your OpenAI plan if needed`;
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
          errorContent = `🛠️ **Server Error**\n\nThere's an issue with the backend server.\n\n**Please check:**\n1. Backend server is running on port 8001\n2. Your internet connection is stable\n3. Try refreshing the page`;
        } else {
          errorContent = `❌ **Error**: ${error.message}\n\n**Please check:**\n1. Your API key is correct\n2. The backend server is running\n3. Your internet connection is stable\n\nLet's get this compliance consultation back on track! 📋`;
        }
      } else {
        errorContent = '❌ **Unknown error occurred**\n\nPlease try again or refresh the page.';
      }

      const errorMsg: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'ai',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPDF = async (file: File, apiKey: string) => {
    if (!file || !apiKey.trim()) return;

    setIsProcessingPDF(true);

    try {
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('api_key', apiKey);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPdfUploaded(true);
        setPdfName(file.name);
        setSuggestedQuestions(result.suggested_questions || []);
        setMessages([]); // Clear previous messages

        // Add success message
        const successMsg: ChatMessage = {
          id: Date.now().toString() + '_success',
          type: 'ai',
          content: `Online casino compliance document "${file.name}" has been successfully analyzed and indexed! 📋✨\n\nI'm ready to provide expert consultation on your compliance requirements. Ask me about RTP obligations, licensing requirements, gaming regulations, or any other aspect of online casino compliance!`,
          timestamp: new Date()
        };
        setMessages([successMsg]);
      } else {
        throw new Error(result.message || 'Compliance document processing failed');
      }

    } catch (error) {
      console.error('Error uploading compliance document:', error);
      let errorContent = '';

      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Incorrect API key')) {
          errorContent = `🔑 **Invalid API Key Error During Upload**\n\nYour OpenAI API key appears to be incorrect.\n\n**Please:**\n1. ✅ Verify your API key is correct\n2. ✅ Make sure it starts with "sk-"\n3. ✅ Check you have sufficient credits\n\nThen try uploading your document again.`;
        } else if (error.message.includes('413') || error.message.includes('too large')) {
          errorContent = `📄 **File Too Large**\n\nThe PDF file is too large to process.\n\n**Please:**\n1. Try a smaller PDF file\n2. Compress your PDF\n3. Use a file under 10MB`;
        } else {
          errorContent = `❌ **Document Upload Error**: ${error.message}\n\n**Please check:**\n1. The file is a valid PDF document\n2. Your API key is correct\n3. The file size is not too large\n4. The backend server is running\n\nTry uploading your compliance document again. 📋`;
        }
      } else {
        errorContent = '❌ **Unknown upload error**\n\nPlease try uploading again or refresh the page.';
      }

      const errorMsg: ChatMessage = {
        id: Date.now().toString() + '_doc_error',
        type: 'ai',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessingPDF(false);
    }
  };

  return (
    <Terminal
      onSendMessage={handleSendMessage}
      onUploadPDF={handleUploadPDF}
      messages={messages}
      isLoading={isLoading}
      isProcessingPDF={isProcessingPDF}
      pdfUploaded={pdfUploaded}
      pdfName={pdfName}
      suggestedQuestions={suggestedQuestions}
      followUpQuestions={followUpQuestions}
      showInitialQuestions={showInitialQuestions}
    />
  );
}