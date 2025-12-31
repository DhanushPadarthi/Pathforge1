'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Book, Clock, Award, TrendingUp, Copy } from 'react-feather';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface RoadmapTemplate {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_weeks: number;
  modules: any[];
}

export default function RoadmapTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<RoadmapTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'computer-science', label: 'CS Fundamentals' },
    { value: 'web-development', label: 'Web Dev' },
    { value: 'devops', label: 'DevOps' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'security', label: 'Security' },
    { value: 'blockchain', label: 'Blockchain' }
  ];

  const difficultyColors: Record<string, string> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = selectedCategory === 'all' 
        ? 'http://localhost:8000/api/roadmaps/templates'
        : `http://localhost:8000/api/roadmaps/templates?category=${selectedCategory}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      setCloning(templateId);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(
        `http://localhost:8000/api/roadmaps/templates/${templateId}/clone?user_id=${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        router.push(`/roadmap/${data._id}`);
      }
    } catch (error) {
      console.error('Error cloning template:', error);
    } finally {
      setCloning(null);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-2">
              <Book className="me-2" size={32} />
              Roadmap Templates
            </h2>
            <p className="text-muted">
              Choose from pre-built learning paths designed by experts
            </p>
          </Col>
        </Row>

        {/* Category Filter */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {templates.map((template) => (
              <Col key={template._id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm hover-shadow">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg={difficultyColors[template.difficulty]}>
                        {template.difficulty}
                      </Badge>
                      <Badge bg="secondary">{template.category}</Badge>
                    </div>

                    <Card.Title className="mb-3">{template.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      {template.description}
                    </Card.Text>

                    <div className="d-flex gap-3 mb-3 text-muted small">
                      <div>
                        <Clock size={16} className="me-1" />
                        {template.estimated_weeks} weeks
                      </div>
                      <div>
                        <Book size={16} className="me-1" />
                        {template.modules?.length || 0} modules
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-100"
                      onClick={() => handleCloneTemplate(template._id)}
                      disabled={cloning === template._id}
                    >
                      {cloning === template._id ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="me-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!loading && templates.length === 0 && (
          <Card className="text-center py-5">
            <Card.Body>
              <Book size={48} className="text-muted mb-3" />
              <h5>No templates found</h5>
              <p className="text-muted">Try selecting a different category</p>
            </Card.Body>
          </Card>
        )}
      </Container>

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </>
  );
}
