'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/components/Header';
import { apiRequest } from '@/lib/api';
import { FaBell, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';

interface NotificationPreferences {
  email_enabled: boolean;
  deadline_reminders: boolean;
  days_before_deadline: number;
  weekly_summary: boolean;
  module_completion: boolean;
}

export default function NotificationSettingsPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    deadline_reminders: true,
    days_before_deadline: 3,
    weekly_summary: true,
    module_completion: true,
  });
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      fetchPreferences();
    }
  }, [userData]);

  const fetchPreferences = async () => {
    try {
      const data = await apiRequest(`/api/users/${userData!._id}/notifications`);
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      showError('Failed to load notification preferences');
    } finally {
      setLoadingPrefs(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiRequest(`/api/users/${userData!._id}/notifications`, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      showSuccess('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showError('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingPrefs) {
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
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <FaBell className="me-2" />
                  Notification Settings
                </h4>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="mb-4">
                  <FaEnvelope className="me-2" />
                  Configure how you want to receive updates about your learning progress.
                </Alert>

                {/* Email Notifications */}
                <div className="mb-4">
                  <h5 className="mb-3">Email Notifications</h5>
                  <Form.Check 
                    type="switch"
                    id="email-enabled"
                    label="Enable email notifications"
                    checked={preferences.email_enabled}
                    onChange={(e) => setPreferences({ ...preferences, email_enabled: e.target.checked })}
                    className="mb-3"
                  />
                </div>

                <hr />

                {/* Deadline Reminders */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <FaClock className="me-2" />
                    Deadline Reminders
                  </h5>
                  <Form.Check 
                    type="switch"
                    id="deadline-reminders"
                    label="Send me deadline reminders"
                    checked={preferences.deadline_reminders}
                    onChange={(e) => setPreferences({ ...preferences, deadline_reminders: e.target.checked })}
                    disabled={!preferences.email_enabled}
                    className="mb-3"
                  />
                  
                  {preferences.deadline_reminders && preferences.email_enabled && (
                    <Form.Group className="ms-4">
                      <Form.Label>Remind me when deadline is</Form.Label>
                      <Form.Select 
                        value={preferences.days_before_deadline}
                        onChange={(e) => setPreferences({ ...preferences, days_before_deadline: parseInt(e.target.value) })}
                      >
                        <option value="1">1 day away</option>
                        <option value="3">3 days away</option>
                        <option value="5">5 days away</option>
                        <option value="7">7 days away</option>
                      </Form.Select>
                    </Form.Group>
                  )}
                </div>

                <hr />

                {/* Weekly Summary */}
                <div className="mb-4">
                  <h5 className="mb-3">Weekly Progress Summary</h5>
                  <Form.Check 
                    type="switch"
                    id="weekly-summary"
                    label="Send me weekly progress reports"
                    checked={preferences.weekly_summary}
                    onChange={(e) => setPreferences({ ...preferences, weekly_summary: e.target.checked })}
                    disabled={!preferences.email_enabled}
                  />
                  <Form.Text className="d-block mt-2 ms-4">
                    Every Monday, receive a summary of your learning activity from the past week.
                  </Form.Text>
                </div>

                <hr />

                {/* Module Completion */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <FaCheckCircle className="me-2" />
                    Module Completion
                  </h5>
                  <Form.Check 
                    type="switch"
                    id="module-completion"
                    label="Send congratulations emails when I complete modules"
                    checked={preferences.module_completion}
                    onChange={(e) => setPreferences({ ...preferences, module_completion: e.target.checked })}
                    disabled={!preferences.email_enabled}
                  />
                  <Form.Text className="d-block mt-2 ms-4">
                    Celebrate your achievements with motivational emails!
                  </Form.Text>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
