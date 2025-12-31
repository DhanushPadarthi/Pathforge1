'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { roadmapAPI, skillsAPI } from '@/lib/api';
import { CareerRole } from '@/lib/types';
import { FaRocket } from 'react-icons/fa';

export default function NewRoadmapPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [targetRoleId, setTargetRoleId] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [useCustomRole, setUseCustomRole] = useState(false);
  const [duration, setDuration] = useState('12 weeks');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchRoles();
    if (userData?.target_role_id) {
      setTargetRoleId(userData.target_role_id);
    }
  }, [userData]);

  const fetchRoles = async () => {
    try {
      const data = await skillsAPI.getCareerRoles();
      if (Array.isArray(data)) {
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to load career roles. Please refresh the page.');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) return;

    if (!userData.current_skills || userData.current_skills.length === 0) {
      setError('Please add some skills first or upload your resume');
      return;
    }

    // Validate role selection
    const selectedRole = useCustomRole ? customRole : targetRoleId;
    if (!selectedRole || selectedRole.trim() === '') {
      setError('Please select or enter a career role');
      return;
    }

    try {
      setGenerating(true);
      setError('');

      const roadmap = await roadmapAPI.generate({
        user_id: userData._id,
        target_role_id: useCustomRole ? undefined : targetRoleId,
        custom_role: useCustomRole ? customRole : undefined,
        preferences: {
          duration,
          difficulty,
        },
      });

      router.push(`/roadmap/${roadmap._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
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
        <Row>
          <Col lg={8} className="mx-auto">
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <FaRocket size={50} className="text-primary mb-3" />
                  <h2>Generate Learning Roadmap</h2>
                  <p className="text-muted">
                    Create a personalized learning path powered by AI
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleGenerate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Target Career Role *</Form.Label>
                    
                    {!useCustomRole ? (
                      <>
                        <Form.Select
                          value={targetRoleId}
                          onChange={(e) => setTargetRoleId(e.target.value)}
                          required
                          className="mb-2"
                        >
                          <option value="">Select a role...</option>
                          {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.title}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setUseCustomRole(true);
                            setTargetRoleId('');
                          }}
                        >
                          + Enter Custom Role
                        </Button>
                      </>
                    ) : (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="e.g., Full Stack Developer, ML Engineer, DevOps Specialist..."
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          required
                          className="mb-2"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setUseCustomRole(false);
                            setCustomRole('');
                          }}
                        >
                          ← Select from list
                        </Button>
                      </>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Learning Duration</Form.Label>
                    <Form.Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="4 weeks">4 weeks (Intensive)</option>
                      <option value="8 weeks">8 weeks (Fast)</option>
                      <option value="12 weeks">12 weeks (Balanced)</option>
                      <option value="16 weeks">16 weeks (Comfortable)</option>
                      <option value="24 weeks">24 weeks (Relaxed)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Difficulty Level</Form.Label>
                    <Form.Select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={generating || (!useCustomRole ? !targetRoleId : !customRole)}
                    >
                      {generating ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Generating Roadmap...
                        </>
                      ) : (
                        <>
                          <FaRocket className="me-2" />
                          Generate Roadmap
                        </>
                      )}
                    </Button>
                  </div>

                  {(!userData || !userData.current_skills || userData.current_skills.length === 0) && (
                    <Alert variant="warning" className="mt-3 mb-0">
                      You haven't added any skills yet. Please{' '}
                      <Alert.Link href="/profile">upload your resume</Alert.Link> or{' '}
                      <Alert.Link href="/skills">add skills manually</Alert.Link>.
                    </Alert>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
