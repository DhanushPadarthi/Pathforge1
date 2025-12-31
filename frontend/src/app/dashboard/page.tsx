'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Spinner, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaUpload, FaChartLine, FaRocket, FaGraduationCap, FaFileAlt, FaFire, FaStar, FaTrophy, FaLightbulb } from 'react-icons/fa';
import Header from '@/components/Header';
import { roadmapAPI, skillsAPI } from '@/lib/api';
import { Roadmap } from '@/lib/types';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      fetchRoadmaps();
      calculateGameStats();
      unlockAchievements();
    }
  }, [userData]);

  const calculateGameStats = () => {
    // Calculate XP based on completed resources
    let totalXp = 0;
    let completedResources = 0;
    
    roadmaps.forEach(r => {
      r.modules?.forEach(m => {
        // Count completed module
        if (m.completed) {
          totalXp += 100; // 100 XP per completed module
          completedResources += 1;
        }
        m.resources?.forEach(res => {
          if ((res as any).is_completed) {
            totalXp += 50; // 50 XP per completed resource
            completedResources += 1;
          }
          if ((res as any).is_skipped) {
            totalXp += 10; // 10 XP per skipped resource
          }
        });
      });
    });
    
    setXp(totalXp);
    setLevel(Math.floor(totalXp / 500) + 1);
    setStreak(Math.min(completedResources, 7)); // Max 7-day streak shown
  };

  const unlockAchievements = () => {
    const newAchievements: Achievement[] = [
      {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first resource',
        icon: '👣',
        unlocked: roadmaps.some(r => r.modules?.some(m => m.completed || m.resources?.some(res => (res as any).is_completed)))
      },
      {
        id: 'skill-master',
        name: 'Skill Master',
        description: 'Master 5 skills',
        icon: '🏆',
        unlocked: (userData?.current_skills?.length || 0) >= 5
      },
      {
        id: 'roadmap-warrior',
        name: 'Roadmap Warrior',
        description: 'Complete a full roadmap',
        icon: '⚔️',
        unlocked: roadmaps.some(r => r.modules?.every(m => m.completed))
      },
      {
        id: 'fast-learner',
        name: 'Fast Learner',
        description: 'Complete 10 resources',
        icon: '⚡',
        unlocked: roadmaps.reduce((sum, r) => 
          sum + (r.modules?.reduce((s, m) => 
            s + (m.resources?.filter(res => (res as any).is_completed)?.length || 0), 0) || 0), 0) >= 10
      },
      {
        id: 'project-creator',
        name: 'Project Creator',
        description: 'Complete your first project',
        icon: '🎨',
        unlocked: false // Will be tracked separately
      }
    ];
    
    setAchievements(newAchievements);
  };

  const fetchRoadmaps = async () => {
    try {
      if (!userData) return;
      const data = await roadmapAPI.getUserRoadmaps(userData._id);
      // Backend now returns an array of roadmaps
      const roadsToSet = Array.isArray(data) ? data : [];
      setRoadmaps(roadsToSet);
      
      // Recalculate stats with new roadmap data
      setTimeout(() => {
        calculateGameStats();
        unlockAchievements();
      }, 100);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setRoadmaps([]);
    } finally {
      setLoadingRoadmaps(false);
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

  const totalModules = roadmaps.reduce((sum, r) => sum + (r.modules?.length || 0), 0);
  const completedModules = roadmaps.reduce(
    (sum, r) => sum + (r.modules?.filter(m => m.completed).length || 0),
    0
  );
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <>
      <Header />
      <Container className="py-5">
        {/* Welcome Section with Gamification */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="mb-2">Welcome back, {userData.name}! 👋</h1>
                <p className="text-muted">Here's your learning progress overview</p>
              </div>
              <div className="gamification-badge">
                <div className="level-badge">
                  <FaTrophy size={24} className="text-warning" />
                  <span className="level-number">Level {level}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Gamification Stats - XP and Streak */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Card className="gamification-card xp-card">
              <Card.Body className="d-flex align-items-center">
                <div className="xp-icon">⭐</div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-1">Experience Points</h6>
                  <div className="xp-bar">
                    <ProgressBar 
                      now={(xp % 500) / 5} 
                      className="xp-progress"
                      style={{ height: '8px' }}
                    />
                  </div>
                  <small className="text-muted">{xp} XP • {xp % 500}/500 to next level</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="gamification-card streak-card">
              <Card.Body className="d-flex align-items-center">
                <div className="streak-icon">
                  <FaFire size={32} style={{ color: '#ff6b6b' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-1">Learning Streak</h6>
                  <p className="mb-0"><strong>{streak} day{streak !== 1 ? 's' : ''}</strong> of consistent learning</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                <FaGraduationCap size={28} className="text-primary" />
              </div>
              <h5 className="mt-3">{userData.current_skills.length}</h5>
              <p className="text-muted mb-0">Skills Learned</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <FaRocket size={28} className="text-success" />
              </div>
              <h5 className="mt-3">{roadmaps.length}</h5>
              <p className="text-muted mb-0">Roadmaps Active</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <FaChartLine size={28} className="text-warning" />
              </div>
              <h5 className="mt-3">{completedModules}/{totalModules}</h5>
              <p className="text-muted mb-0">Modules Completed</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                <FaStar size={28} style={{ color: '#a855f7' }} />
              </div>
              <h5 className="mt-3">{achievements.filter(a => a.unlocked).length}/{achievements.length}</h5>
              <p className="text-muted mb-0">Achievements</p>
            </Card>
          </Col>
        </Row>

        {/* Progress Overview */}
        {roadmaps.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className="progress-card">
                <Card.Body>
                  <h5 className="mb-3">Overall Progress</h5>
                  <ProgressBar 
                    now={progressPercentage} 
                    label={`${Math.round(progressPercentage)}%`}
                    className="progress-bar-animated"
                    style={{ height: '28px', borderRadius: '8px' }}
                  />
                  <p className="text-muted mt-3 mb-0">
                    <FaLightbulb size={14} className="me-2" />
                    {completedModules} of {totalModules} modules completed
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Achievements Section */}
        <Row className="mb-4">
          <Col>
            <h4 className="mb-3">🏆 Achievements</h4>
            <Row className="g-3">
              {achievements.map(achievement => (
                <Col md={6} lg={4} key={achievement.id}>
                  <Card className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                    <Card.Body className="text-center">
                      <div className={`achievement-icon ${achievement.unlocked ? 'glow' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h6 className="mt-2 mb-1">{achievement.name}</h6>
                      <small className="text-muted d-block">{achievement.description}</small>
                      {achievement.unlocked && (
                        <Badge bg="success" className="mt-2">✓ Unlocked</Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <h4 className="mb-3">Quick Actions</h4>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          {!userData.has_resume && (
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaUpload size={30} className="text-primary me-3" />
                    <div>
                      <h5 className="mb-0">Upload Resume</h5>
                      <p className="text-muted mb-0">Let AI analyze your skills</p>
                    </div>
                  </div>
                  <Button 
                    variant="primary"
                    onClick={() => router.push('/profile')}
                  >
                    Upload Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
          
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaRocket size={30} className="text-success me-3" />
                  <div>
                    <h5 className="mb-0">Generate Roadmap</h5>
                    <p className="text-muted mb-0">Create your learning path</p>
                  </div>
                </div>
                <Button 
                  variant="success"
                  onClick={() => router.push('/roadmap/new')}
                >
                  Create Roadmap
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaChartLine size={30} className="text-warning me-3" />
                  <div>
                    <h5 className="mb-0">Skill Gap Analysis</h5>
                    <p className="text-muted mb-0">Find what you need to learn</p>
                  </div>
                </div>
                <Button 
                  variant="warning"
                  onClick={() => router.push('/skills/gap-analysis')}
                >
                  Analyze Skills
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Roadmaps */}
        {roadmaps.length > 0 && (
          <>
            <Row className="mb-3">
              <Col>
                <h4>Your Roadmaps</h4>
              </Col>
            </Row>
            <Row className="g-4">
              {roadmaps.slice(0, 3).map((roadmap) => {
                const modules = roadmap.modules || [];
                const completed = modules.filter(m => m.completed).length;
                const total = modules.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                return (
                  <Col md={4} key={roadmap._id}>
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="mb-2">{roadmap.title}</h5>
                        <p className="text-muted small mb-3">
                          {roadmap.target_role}
                        </p>
                        <ProgressBar 
                          now={progress} 
                          label={`${Math.round(progress)}%`}
                          className="mb-3"
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {completed}/{total} modules
                          </small>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => router.push(`/roadmap/${roadmap._id}`)}
                          >
                            Continue
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            {roadmaps.length > 3 && (
              <Row className="mt-3">
                <Col className="text-center">
                  <Button 
                    variant="link"
                    onClick={() => router.push('/roadmap')}
                  >
                    View All Roadmaps →
                  </Button>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
}
