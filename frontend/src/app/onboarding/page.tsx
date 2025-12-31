'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaClock, FaBriefcase, FaLightbulb } from 'react-icons/fa';
import Header from '@/components/Header';
import { userAPI, skillsAPI } from '@/lib/api';
import { CareerRole } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { userData, refreshUserData } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [name, setName] = useState(userData?.name || '');
  const [targetRole, setTargetRole] = useState('');
  const [availableHours, setAvailableHours] = useState(10);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [roles, setRoles] = useState<CareerRole[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch career roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await skillsAPI.getCareerRoles();
        setRoles(data);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (step === 2 && !targetRole) {
      setError('Please select a target role');
      return;
    }
    if (step === 3 && availableHours < 1) {
      setError('Please set available hours (minimum 1 hour/week)');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (interests.length === 0) {
      setError('Please add at least one skill or interest');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Complete profile without resume
      await userAPI.completeProfile(userData!._id, {
        name: name.trim(),
        target_role: targetRole,
        available_hours_per_week: availableHours,
        interests: interests
      });

      await refreshUserData();
      
      // Redirect to generate roadmap
      router.push('/roadmap/new');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2>Welcome to PathForge! 🚀</h2>
                  <p className="text-muted">Let's personalize your learning journey</p>
                  <ProgressBar 
                    now={progressPercentage} 
                    label={`Step ${step} of ${totalSteps}`}
                    className="mt-3"
                  />
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <FaUser size={50} className="text-primary mb-3" />
                      <h4>Tell us about yourself</h4>
                    </div>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>What's your name?</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        size="lg"
                        autoFocus
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        disabled={!name.trim()}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Career Goal */}
                {step === 2 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <FaBriefcase size={50} className="text-success mb-3" />
                      <h4>What's your career goal?</h4>
                      <p className="text-muted">Choose the role you want to pursue</p>
                    </div>

                    <Form.Group className="mb-4">
                      <Form.Label>Target Career Role</Form.Label>
                      <Form.Select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        size="lg"
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.title}
                          </option>
                        ))}
                      </Form.Select>
                      {targetRole && roles.find(r => r._id === targetRole) && (
                        <div className="mt-3 p-3 bg-light rounded">
                          <small className="text-muted">
                            <strong>Description:</strong>{' '}
                            {roles.find(r => r._id === targetRole)?.description}
                          </small>
                        </div>
                      )}
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={handleBack}>
                        ← Back
                      </Button>
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleNext}
                        disabled={!targetRole}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Time Commitment */}
                {step === 3 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <FaClock size={50} className="text-warning mb-3" />
                      <h4>How much time can you dedicate?</h4>
                      <p className="text-muted">Help us plan your learning schedule</p>
                    </div>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        Available Hours Per Week: <strong>{availableHours} hours</strong>
                      </Form.Label>
                      <Form.Range
                        min={1}
                        max={40}
                        value={availableHours}
                        onChange={(e) => setAvailableHours(parseInt(e.target.value))}
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">1 hour</small>
                        <small className="text-muted">40 hours</small>
                      </div>
                    </Form.Group>

                    <div className="alert alert-info">
                      <small>
                        💡 <strong>Tip:</strong> {' '}
                        {availableHours < 5 && "Even small consistent effort makes progress!"}
                        {availableHours >= 5 && availableHours < 15 && "Great balance for steady learning!"}
                        {availableHours >= 15 && "Intensive learning mode - you'll progress quickly!"}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={handleBack}>
                        ← Back
                      </Button>
                      <Button variant="primary" size="lg" onClick={handleNext}>
                        Next →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Skills & Interests */}
                {step === 4 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <FaLightbulb size={50} className="text-info mb-3" />
                      <h4>What skills do you already have?</h4>
                      <p className="text-muted">Add any programming languages, frameworks, or tools you know</p>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Add Skills or Interests</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="text"
                          placeholder="e.g., Python, JavaScript, React..."
                          value={interestInput}
                          onChange={(e) => setInterestInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                        />
                        <Button 
                          variant="outline-primary"
                          onClick={handleAddInterest}
                          disabled={!interestInput.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Press Enter or click Add. Leave empty if you're starting fresh!
                      </Form.Text>
                    </Form.Group>

                    {interests.length > 0 && (
                      <div className="mb-4">
                        <p className="mb-2"><strong>Your Skills:</strong></p>
                        <div className="d-flex flex-wrap gap-2">
                          {interests.map((interest, idx) => (
                            <span 
                              key={idx}
                              className="badge bg-primary d-flex align-items-center gap-2"
                              style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
                              onClick={() => handleRemoveInterest(interest)}
                            >
                              {interest} ✕
                            </span>
                          ))}
                        </div>
                        <small className="text-muted d-block mt-2">Click to remove</small>
                      </div>
                    )}

                    {interests.length === 0 && (
                      <div className="alert alert-light border">
                        <small className="text-muted">
                          No skills added yet. That's okay - we'll start from the basics!
                        </small>
                      </div>
                    )}

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={handleBack}>
                        ← Back
                      </Button>
                      <Button 
                        variant="success" 
                        size="lg"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? 'Setting up...' : 'Complete Setup 🎉'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Alternative option */}
            {step === 1 && (
              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have a resume?{' '}
                  <Button 
                    variant="link" 
                    className="p-0"
                    onClick={() => router.push('/profile')}
                  >
                    Upload it here
                  </Button>
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
