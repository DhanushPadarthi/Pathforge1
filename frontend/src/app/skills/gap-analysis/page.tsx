'use client';

import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

interface SkillGap {
  skill: string;
  current_level: string;
  required_level: string;
  gap_severity: string;
  learning_priority: string;
}

export default function SkillGapAnalysis() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<{
    target_role: string;
    skill_gaps: SkillGap[];
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userData) {
      fetchAnalysis();
    }
  }, [userData]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      
      if (!userData) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/roadmaps/user/${userData._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch skill gap analysis');
      }

      const roadmaps = await response.json();
      
      if (!roadmaps || roadmaps.length === 0) {
        setError('No roadmap found. Please generate a roadmap first from the dashboard.');
        setLoading(false);
        return;
      }
      
      // Use the most recent roadmap (last in array)
      const roadmap = roadmaps[roadmaps.length - 1];
      
      setAnalysis({
        target_role: roadmap.target_role,
        skill_gaps: roadmap.skill_gaps || [],
        recommendations: roadmap.recommendations || []
      });
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load skill gap analysis');
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string | undefined) => {
    if (!severity) return 'secondary';
    switch (severity.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return 'secondary';
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  if (authLoading || !userData) {
    return (
      <>
        <Header />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading...</p>
        </Container>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Analyzing your skill gaps...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </button>
            </div>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
      <div className="mb-4">
        <h1>Skill Gap Analysis</h1>
        {analysis && (
          <p className="text-muted">
            Analysis for: <strong>{analysis.target_role}</strong>
          </p>
        )}
      </div>

      {analysis && analysis.skill_gaps.length > 0 ? (
        <>
          <Row className="g-4">
            {analysis.skill_gaps.map((gap, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      <span>{gap.skill}</span>
                      <Badge bg={getSeverityColor(gap.gap_severity)}>
                        {gap.gap_severity || 'N/A'}
                      </Badge>
                    </Card.Title>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="text-muted">Current Level</small>
                        <Badge bg="secondary">{gap.current_level || 'N/A'}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <small className="text-muted">Required Level</small>
                        <Badge bg="primary">{gap.required_level || 'N/A'}</Badge>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Priority</small>
                        <Badge bg={getPriorityColor(gap.learning_priority)}>
                          {gap.learning_priority || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card className="mt-5 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Recommendations</h5>
              </Card.Header>
              <Card.Body>
                <ul className="mb-0">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="mb-2">{rec}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}

          <div className="mt-4 text-center">
            <button 
              className="btn btn-primary me-3"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => router.push('/skills')}
            >
              Manage Skills
            </button>
          </div>
        </>
      ) : (
        <Alert variant="info">
          <Alert.Heading>No Skill Gaps Found</Alert.Heading>
          <p>
            Either you haven't generated a roadmap yet, or your current skills already match your target role!
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>
              Generate Roadmap
            </button>
          </div>
        </Alert>
      )}
      </Container>
    </>
  );
}
