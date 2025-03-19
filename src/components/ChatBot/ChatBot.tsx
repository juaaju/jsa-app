// src/components/ChatBot/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, ExternalLink, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ChatBot.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Tipe untuk menyimpan history conversasi untuk API Deepseek
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Halo! Saya Safety Assistant, siap membantu Anda dengan pertanyaan seputar keselamatan kerja. Apa yang bisa saya bantu hari ini?", sender: 'bot' }
  ]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([
    { role: 'assistant', content: "Halo! Saya Safety Assistant, siap membantu Anda dengan pertanyaan seputar keselamatan kerja. Apa yang bisa saya bantu hari ini?" }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    // Reset maximize state when closing
    if (isOpen) setIsMaximized(false);
  };

  const toggleMaximize = (): void => {
    setIsMaximized(!isMaximized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    // Add user message to UI
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Add to conversation history for API
    const userConversationMsg = { role: 'user' as const, content: inputValue };
    const updatedHistory = [...conversationHistory, userConversationMsg];
    setConversationHistory(updatedHistory);
    
    // Clear input and set loading
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Deepseek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`// Use your API key from environment variables
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // or the specific model you want to use
          messages: [
            // System message to instruct the model about JSA and safety
            { 
              role: 'system', 
              content: 'You are a Safety Assistant specialized in Job Safety Analysis (JSA) and workplace safety. Provide helpful, accurate information about hazard identification, risk assessment, and safety procedures. Keep responses concise and focused on safety topics.' 
            },
            ...updatedHistory
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      // Add bot message to UI
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      // Show error to user
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: 'Maaf, terjadi kesalahan saat menghubungi assistant. Silakan coba lagi.', sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chatbot-container">
      {/* Floating chat button */}
      {!isOpen && (
        <button 
          className="chat-button"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`chat-window ${isMaximized ? 'maximized' : ''}`}>
          {/* Chat header */}
          <div className="chat-header">
            <h3>Safety Assistant</h3>
            <div className="chat-controls">
              {isMaximized ? (
                <button className="icon-button" onClick={toggleMaximize}>
                  <Minimize2 size={18} />
                </button>
              ) : (
                <button className="icon-button" onClick={toggleMaximize}>
                  <Maximize2 size={18} />
                </button>
              )}
              <button className="icon-button" onClick={toggleChat}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Navigation links */}
          <div className="chat-links">
            <p>Akses cepat ke:</p>
            <div className="nav-buttons">
              <Link to="/" className="nav-link">
                Beranda <ExternalLink size={14} />
              </Link>
              <Link to="/new-l2sa" className="nav-link">
                Buat L2SA <ExternalLink size={14} />
              </Link>
              <Link to="/analysis" className="nav-link">
                Analisis Risiko <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ketik pesan Anda..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-button" 
              disabled={!inputValue.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;