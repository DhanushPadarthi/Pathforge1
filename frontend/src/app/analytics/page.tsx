'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { apiRequest } from '@/lib/api';
import { FaFire, FaClock, FaCheckCircle, FaTrophy, FaCalendar, FaChartLine } from 'react-icons/fa';

interface Analytics {
  learning_streak: number;
  total_time_spent: number;
  total_resources_completed: number;
  total_resources_skipped: number;
  total_modules_completed: number;
  average_progress: number;
  daily_activity: Array<{ date: string; completed: number; time_spent: number }>;
  weekly_summary: {
    this_week_hours: number;
    this_week_resources: number;
    this_week_progress: number;
  };
  completion_rate: number;
  most_productive_day: string | null;
}

export default function AnalyticsPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      fetchAnalytics();
    }
  }, [userData]);

  const fetchAnalytics = async () => {
    try {
      const data = await apiRequest(`/api/analytics/${userData!._id}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading || loadingAnalytics) {
    return (
      <>
        <Header />
        <div className="loading-screen">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (!analytics) {
    return (
      <>
        <Header />
        <Container className="py-5">
          <Alert variant="info">No analytics data available yet. Start learning to see your stats!</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4">
          <FaChartLine className="me-2" />
          My Learning Analytics
        </h2>

        {/* Key Metrics */}
        <Row className="g-4 mb-4">
          {/* Learning Streak */}
          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 mb-2">
                  {analytics.learning_streak > 0 ? <FaFire style={{ color: '#ff6b35' }} /> : <FaFire style={{ color: '#ccc' }} />}
                </div>
                <h3 className="mb-0">{analytics.learning_streak}</h3>
                <p className="text-muted mb-0">Day Streak</p>
                {analytics.learning_streak > 0 && (
                  <small className="text-success">Keep it going!</small>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Total Time */}
          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 mb-2 text-primary">
                  <FaClock />
                </div>
                <h3 className="mb-0">{formatTime(analytics.total_time_spent)}</h3>
                <p className="text-muted mb-0">Total Time</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Resources Completed */}
          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 mb-2 text-success">
                  <FaCheckCircle />
                </div>
                <h3 className="mb-0">{analytics.total_resources_completed}</h3>
                <p className="text-muted mb-0">Resources Done</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Modules Completed */}
          <Col md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 mb-2 text-warning">
                  <FaTrophy />
                </div>
                <h3 className="mb-0">{analytics.total_modules_completed}</h3>
                <p className="text-muted mb-0">Modules Done</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Stats */}
        <Row className="g-4 mb-4">
          {/* This Week Summary */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaCalendar className="me-2" />
                  This Week
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Time Spent</span>
                    <strong>{analytics.weekly_summary.this_week_hours}h</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Resources Completed</span>
                    <strong>{analytics.weekly_summary.this_week_resources}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Overall Stats */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Overall Performance</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Average Progress</span>
                    <strong>{analytics.average_progress}%</strong>
                  </div>
                  <ProgressBar 
                    now={analytics.average_progress} 
                    variant="success" 
                    className="mb-3"
                  />
                  
                  <div className="d-flex justify-content-between mb-1">
                    <span>Completion Rate</span>
                    <strong>{analytics.completion_rate}%</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Most Productive Day</span>
                    <strong>{analytics.most_productive_day || 'N/A'}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Last 30 Days Activity */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Last 30 Days Activity</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-1 align-items-end" style={{ height: '100px' }}>
                  {analytics.daily_activity.map((day, index) => {
                    const maxCompleted = Math.max(...analytics.daily_activity.map(d => d.completed), 1);
                    const heightPercentage = (day.completed / maxCompleted) * 100;
                    
                    return (
                      <div 
                        key={index} 
                        className="flex-fill"
                        title={`${day.date}: ${day.completed} resources, ${formatTime(day.time_spent)}`}
                      >
                        <div 
                          style={{ 
                            height: `${heightPercentage}%`, 
                            backgroundColor: day.completed > 0 ? '#667eea' : '#e0e0e0',
                            borderRadius: '2px'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">30 days ago</small>
                  <small className="text-muted">Today</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
