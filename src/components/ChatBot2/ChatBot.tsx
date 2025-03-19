// src/components/ChatBot/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, ExternalLink, Maximize2, Paperclip, FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ChatBot.css';

// Tambahkan library untuk parsing markdown
// Anda perlu menginstal:
// npm install react-markdown

import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  documentIds?: string[]; // IDs dokumen yang terkait dengan pesan
}

// Tipe untuk dokumen yang telah diupload
interface Document {
  id: string;
  title: string;
  filename?: string;
  metadata?: any;
}

// Tipe untuk API response
interface ApiResponse {
  result: string;
  stats?: {
    tokens?: number;
    time?: number;
  };
  documents_used?: Array<{
    id: string;
    content: string;
    similarity: number;
  }>;
  error?: string;
  traceback?: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Halo! Saya Safety Assistant, siap membantu Anda dengan pertanyaan seputar keselamatan kerja. Apa yang bisa saya bantu hari ini?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // State untuk menangani file yang diupload
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useRag, setUseRag] = useState<boolean>(true);

  // API URL dari environment variable atau hardcoded
  const API_URL = import.meta.env.VITE_LMSTUDIO_API_URL || 'http://localhost:8000';

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

  const handleFileClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (): Promise<void> => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name);
      
      const response = await fetch(`${API_URL}/documents/file`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload error: ${response.status}`);
      }
      
      const data = await response.json();
      setUploadedDocuments(prev => [...prev, {
        id: data.id,
        title: data.title,
        filename: selectedFile.name
      }]);
      
      // Tambahkan pesan sistem tentang berhasil mengunggah file
      setMessages(prev => [...prev, {
        text: `File berhasil diunggah: ${selectedFile.name}`,
        sender: 'bot'
      }]);
      
      // Reset selectedFile
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => [...prev, {
        text: `Terjadi kesalahan saat mengunggah file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'bot'
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = (docId: string): void => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    // Upload file jika ada
    if (selectedFile) {
      await uploadFile();
    }

    // Add user message to UI
    const userMessage: Message = { 
      text: inputValue, 
      sender: 'user',
      documentIds: uploadedDocuments.map(doc => doc.id)
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input and set loading
    setInputValue('');
    setIsLoading(true);

    try {
      // Call LM Studio API
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          use_rag: useRag,
          document_ids: uploadedDocuments.map(doc => doc.id) // Kirim ID dokumen untuk RAG
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add bot message to UI
      setMessages(prevMessages => [...prevMessages, { 
        text: data.result, 
        sender: 'bot',
        documentIds: data.documents_used?.map(doc => doc.id)
      }]);
      
    } catch (error) {
      console.error('Error calling LM Studio API:', error);
      // Show error to user
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: `Maaf, terjadi kesalahan saat menghubungi assistant. ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`, sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRag = (): void => {
    setUseRag(!useRag);
    // Notify user of mode change
    setMessages(prev => [...prev, {
      text: !useRag 
        ? "Mode RAG diaktifkan. Jawaban akan mempertimbangkan dokumen yang diunggah." 
        : "Mode RAG dinonaktifkan. Jawaban akan berdasarkan pengetahuan model saja.",
      sender: 'bot'
    }]);
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Effect untuk upload file saat dipilih
  useEffect(() => {
    if (selectedFile) {
      uploadFile();
    }
  }, [selectedFile]);

  // Fungsi untuk memformat teks dengan markdown
  const formatMessageText = (text: string, sender: string) => {
    // Jika pesan dari user, tampilkan sebagai teks biasa
    if (sender === 'user') {
      return <div>{text}</div>;
    }
    
    // Jika pesan dari bot, render sebagai markdown
    return (
      <ReactMarkdown
        components={{
          // Kustomisasi komponen untuk menambahkan class styling
          h1: ({node, ...props}) => <h1 className="md-h1" {...props} />,
          h2: ({node, ...props}) => <h2 className="md-h2" {...props} />,
          h3: ({node, ...props}) => <h3 className="md-h3" {...props} />,
          h4: ({node, ...props}) => <h4 className="md-h4" {...props} />,
          p: ({node, ...props}) => <p className="md-p" {...props} />,
          ul: ({node, ...props}) => <ul className="md-ul" {...props} />,
          ol: ({node, ...props}) => <ol className="md-ol" {...props} />,
          li: ({node, ...props}) => <li className="md-li" {...props} />,
          strong: ({node, ...props}) => <strong className="md-strong" {...props} />,
          em: ({node, ...props}) => <em className="md-em" {...props} />,
          a: ({node, ...props}) => <a className="md-a" target="_blank" rel="noopener noreferrer" {...props} />,
          code: ({node, ...props}) => <code className="md-code" {...props} />,
          pre: ({node, ...props}) => <pre className="md-pre" {...props} />
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

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
              <button 
                className={`rag-toggle ${useRag ? 'active' : ''}`} 
                onClick={toggleRag}
                title={useRag ? "RAG Aktif" : "RAG Nonaktif"}
              >
                RAG
              </button>
              {isMaximized ? (
                <button className="icon-button" onClick={toggleMaximize} title="Perkecil">
                  <Minimize2 size={18} />
                </button>
              ) : (
                <button className="icon-button" onClick={toggleMaximize} title="Perbesar">
                  <Maximize2 size={18} />
                </button>
              )}
              <button className="icon-button" onClick={toggleChat} title="Tutup">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {formatMessageText(message.text, message.sender)}
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

          {/* Uploaded documents section */}
          {uploadedDocuments.length > 0 && (
            <div className="uploaded-documents">
              <h4>Dokumen yang Diunggah:</h4>
              <div className="document-list">
                {uploadedDocuments.map(doc => (
                  <div key={doc.id} className="document-item">
                    <FileText size={14} />
                    <span className="document-name">{doc.title}</span>
                    <button 
                      className="remove-document" 
                      onClick={() => removeDocument(doc.id)}
                      title="Hapus dokumen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={isLoading || isUploading}
            />
            
            {/* File upload button */}
            <button 
              type="button"
              className="attachment-button" 
              onClick={handleFileClick}
              disabled={isLoading || isUploading}
              title="Lampirkan file"
            >
              <Paperclip size={18} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </button>
            
            <button 
              type="submit" 
              className="send-button" 
              disabled={!inputValue.trim() || isLoading || isUploading}
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