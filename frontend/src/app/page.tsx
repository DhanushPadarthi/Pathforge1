'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaRocket, FaChartLine, FaBrain, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '3rem 0',
        position: 'relative'
      }}>
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0
        }}></div>
        
        <Container style={{position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '3rem'}}>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 style={{fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)'}}>
                PathForge
              </h1>
              <p style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: '500', textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>
                AI-forged learning roadmaps to your career
              </p>
              <p style={{marginBottom: '2rem', color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>
                Build career-ready skills through personalized, AI-driven learning roadmaps 
                tailored to your current skill level and career goals.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Button 
                  variant="light" 
                  size="lg"
                  onClick={() => router.push('/register')}
                  style={{fontWeight: 'bold'}}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => router.push('/login')}
                  style={{fontWeight: 'bold'}}
                >
                  Login
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <div className="p-5">
                <FaGraduationCap size={200} style={{color: '#ffffff', opacity: 0.85}} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">How PathForge Helps You</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="card h-100 text-center p-4">
                <div className="mb-3">
                  <FaBrain size={50} className="text-primary" />
                </div>
                <h5 className="card-title">AI-Powered Analysis</h5>
                <p className="card-text">
                  Upload your resume or answer questions. AI analyzes your skills and experience.
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card h-100 text-center p-4">
                <div className="mb-3">
                  <FaChartLine size={50} className="text-primary" />
                </div>
                <h5 className="card-title">Skill Gap Analysis</h5>
                <p className="card-text">
                  Identify what you need to learn to reach your dream career role.
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card h-100 text-center p-4">
                <div className="mb-3">
                  <FaRocket size={50} className="text-primary" />
                </div>
                <h5 className="card-title">Personalized Roadmaps</h5>
                <p className="card-text">
                  Get a step-by-step learning path with curated resources and timelines.
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card h-100 text-center p-4">
                <div className="mb-3">
                  <FaGraduationCap size={50} className="text-primary" />
                </div>
                <h5 className="card-title">Progress Tracking</h5>
                <p className="card-text">
                  Track your learning journey with visual progress indicators.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Start Your Journey?</h2>
          <p className="lead mb-4">
            Join thousands of students and graduates building their dream careers
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/register')}
          >
            Create Free Account
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container className="text-center">
          <p className="mb-0">&copy; 2025 PathForge. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
