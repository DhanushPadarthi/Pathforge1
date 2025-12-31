'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { FaRobot, FaPaperPlane, FaTrash } from 'react-icons/fa';
import Header from '@/components/Header';
import api from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m PathForge AI Assistant. I\'m here to help you with your learning journey. Ask me anything about:\n\n• Generating learning roadmaps\n• Finding project ideas\n• Understanding skill gaps\n• Navigating PathForge features\n• Study tips and strategies\n\nWhat would you like help with today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chatbot/chat', {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        include_context: true
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Hi! I\'m PathForge AI Assistant. How can I help you today?'
      }
    ]);
  };

  return (
    <>
      <Header />
      <Container fluid className="py-4" style={{ maxWidth: '900px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <FaRobot size={32} className="text-primary me-3" />
              <div>
                <h2 className="mb-0">PathForge AI Assistant</h2>
                <small className="text-muted">Your personal learning companion</small>
              </div>
            </div>
          </Col>
        </Row>

        {/* Chat Messages */}
        <Card className="flex-grow-1 mb-3 overflow-auto" style={{ minHeight: '500px' }}>
          <Card.Body className="d-flex flex-column">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.role === 'user' ? 'text-end' : 'text-start'}`}
              >
                <div
                  className={`d-inline-block p-3 rounded ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-light border'
                  }`}
                  style={{ maxWidth: '80%', wordWrap: 'break-word' }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-3 text-start">
                <div className="d-inline-block p-3 rounded bg-light border">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>PathForge is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>
        </Card>

        {/* Input */}
        <Row>
          <Col>
            <Form onSubmit={handleSendMessage} className="d-flex gap-2">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ask me anything about PathForge, learning, skills, roadmaps, projects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="rounded"
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded"
                >
                  <FaPaperPlane className="me-2" />
                  Send
                </Button>
              </InputGroup>
              <Button
                variant="outline-danger"
                onClick={clearChat}
                disabled={loading}
                className="rounded"
                title="Clear chat"
              >
                <FaTrash />
              </Button>
            </Form>
            <small className="text-muted mt-2 d-block">
              💡 Tip: Ask about roadmaps, projects, skills, progress, or how to use PathForge features!
            </small>
          </Col>
        </Row>
      </Container>
    </>
  );
}
