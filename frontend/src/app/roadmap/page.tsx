'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ProgressBar, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { roadmapAPI } from '@/lib/api';
import { Roadmap } from '@/lib/types';
import { FaPlus, FaRocket, FaClock, FaSearch, FaTrash, FaDownload, FaShare } from 'react-icons/fa';

export default function RoadmapPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      fetchRoadmaps();
    }
  }, [userData, searchTerm, statusFilter, sortBy]);

  const fetchRoadmaps = async () => {
    try {
      setLoadingRoadmaps(true);
      const data = await roadmapAPI.getUserRoadmaps(
        userData!._id, 
        searchTerm || undefined,
        statusFilter !== 'all' ? statusFilter : undefined,
        sortBy
      );
      // Backend now returns an array of roadmaps
      setRoadmaps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setRoadmaps([]);
    } finally {
      setLoadingRoadmaps(false);
    }
  };

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (!window.confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(roadmapId);
      await roadmapAPI.deleteRoadmap(roadmapId);
      setRoadmaps(roadmaps.filter(r => r._id !== roadmapId));
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      alert('Failed to delete roadmap. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const exportRoadmap = (roadmap: Roadmap) => {
    const dataStr = JSON.stringify(roadmap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roadmap.title.replace(/\s+/g, '_')}_roadmap.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !userData) {
    return (
      <>
        <Header />
        <div className="loading-screen">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My Learning Roadmaps</h2>
              <Button variant="primary" onClick={() => router.push('/roadmap/new')}>
                <FaPlus className="me-2" />
                Generate New Roadmap
              </Button>
            </div>
            
            {/* Search and Filters */}
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by career role or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created_at">Newest First</option>
                  <option value="-created_at">Oldest First</option>
                  <option value="updated_at">Recently Updated</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>

        {loadingRoadmaps ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : roadmaps.length > 0 ? (
          <Row className="g-4">
            {roadmaps.map((roadmap) => {
              const modules = roadmap.modules || [];
              const completed = modules.filter(m => m.completed).length;
              const total = modules.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              const isCompleted = completed === total && total > 0;

              return (
                <Col md={6} lg={4} key={roadmap._id}>
                  <Card className={`roadmap-card h-100 ${isCompleted ? 'completed' : ''}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-0">{roadmap.title}</h5>
                          {isCompleted && <span className="achievement-badge ms-2">🏆</span>}
                        </div>
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            title="Export roadmap"
                            onClick={() => exportRoadmap(roadmap)}
                            className="btn-sm"
                          >
                            <FaDownload size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete roadmap"
                            disabled={deletingId === roadmap._id}
                            onClick={() => handleDeleteRoadmap(roadmap._id)}
                            className="btn-sm"
                          >
                            {deletingId === roadmap._id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted small mb-3">{roadmap.target_role}</p>
                      <p className="small mb-3">{roadmap.description}</p>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Progress</span>
                          <span><strong>{completed}/{total}</strong> modules</span>
                        </div>
                        <ProgressBar 
                          now={progress} 
                          className="roadmap-progress"
                          style={{ height: '10px' }}
                        />
                      </div>

                      <div className="d-flex align-items-center text-muted small mb-3">
                        <FaClock className="me-2" />
                        <span>{roadmap.estimated_total_duration}</span>
                      </div>

                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => router.push(`/roadmap/${roadmap._id}`)}
                      >
                        {completed === total ? 'Review' : 'Continue Learning'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Card className="text-center p-5">
            <Card.Body>
              <FaRocket size={60} className="text-muted mb-3" />
              <h4>No roadmaps yet</h4>
              <p className="text-muted mb-4">
                Generate your first personalized learning roadmap with AI
              </p>
              <Button variant="primary" onClick={() => router.push('/roadmap/new')}>
                <FaPlus className="me-2" />
                Generate Roadmap
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
