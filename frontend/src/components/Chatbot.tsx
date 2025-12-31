'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Send, MessageCircle, User, X, MessageSquare } from 'react-feather';
import styles from './Chatbot.module.css';
import { auth } from '@/lib/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onClose?: () => void;
  floating?: boolean;
}

export default function Chatbot({ onClose, floating = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your PathForge AI Assistant. I can help you with:\n\n• Learning strategies and tips\n• Questions about your roadmap\n• Career advice\n• Study motivation\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Get Firebase token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('Please login to use the chatbot');
        setLoading(false);
        return;
      }
      
      const token = await currentUser.getIdToken();
      
      const response = await fetch('http://localhost:8000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          include_context: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatContent = (
    <Card className={floating ? styles.floatingChat : styles.fullChat}>
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <div className="d-flex align-items-center gap-2">
          <MessageCircle size={20} />
          <strong>PathForge AI Assistant</strong>
        </div>
        {onClose && (
          <Button variant="link" className="text-white p-0" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </Card.Header>

      <Card.Body className={styles.chatBody}>
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageIcon}>
                {message.role === 'user' ? <User size={18} /> : <MessageCircle size={18} />}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageIcon}>
                <MessageCircle size={18} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card.Body>

      <Card.Footer className={styles.chatFooter}>
        {error && (
          <Alert variant="danger" className="mb-2 py-1 small">
            {error}
          </Alert>
        )}
        <Form.Group className="d-flex gap-2">
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </Form.Group>
      </Card.Footer>
    </Card>
  );

  if (floating) {
    return chatContent;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          {chatContent}
        </Col>
      </Row>
    </Container>
  );
}
