'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { TrendingUp, DollarSign, Briefcase, Award, Settings, Filter } from 'react-feather';
import api from '@/lib/api';
import Header from '@/components/Header';

interface TrendingSkill {
  skill_name: string;
  category: string;
  demand_score: number;
  growth_rate: string;
  average_salary: string;
  job_openings: number;
  trending_since: string;
  related_skills: string[];
  top_companies: string[];
  career_paths: string[];
}

interface MarketAnalytics {
  total_job_openings: number;
  average_growth_rate: string;
  total_skills_tracked: number;
  top_categories: Array<{
    category: string;
    avg_demand_score: number;
    total_jobs: number;
  }>;
  fastest_growing: TrendingSkill[];
}

export default function TrendingSkillsPage() {
  const [skills, setSkills] = useState<TrendingSkill[]>([]);
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<TrendingSkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSkills();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, categoriesRes, analyticsRes] = await Promise.all([
        api.get('/api/trending/skills'),
        api.get('/api/trending/categories'),
        api.get('/api/trending/analytics')
      ]);

      setSkills(skillsRes || []);
      setCategories((categoriesRes && categoriesRes.categories) || []);
      setAnalytics(analyticsRes || {});
    } catch (err: any) {
      setError('Failed to load trending skills data');
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const endpoint = selectedCategory 
        ? `/api/trending/skills?category=${encodeURIComponent(selectedCategory)}`
        : '/api/trending/skills';
      const response = await api.get(endpoint);
      setSkills(response || []);
    } catch (err: any) {
      console.error('Failed to load skills:', err);
    }
  };

  const getDemandColor = (score: number) => {
    if (score >= 90) return 'danger';
    if (score >= 70) return 'warning';
    return 'info';
  };

  const getGrowthColor = (rate: string) => {
    const value = parseInt(rate.replace('+', '').replace('%', ''));
    if (value >= 100) return 'success';
    if (value >= 50) return 'primary';
    return 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading market data...</p>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">
          <TrendingUp className="me-2" />
          Trending Skills & Market Demand
        </h1>
        <p className="text-muted">
          Real-time market analysis to guide your learning path
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Market Analytics Overview */}
      {analytics && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <Briefcase size={32} className="text-primary mb-2" />
                <h3>{analytics.total_job_openings.toLocaleString()}</h3>
                <small className="text-muted">Total Job Openings</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <TrendingUp size={32} className="text-success mb-2" />
                <h3>{analytics.average_growth_rate}</h3>
                <small className="text-muted">Avg Growth Rate</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <Award size={32} className="text-warning mb-2" />
                <h3>{analytics.total_skills_tracked}</h3>
                <small className="text-muted">Skills Tracked</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <Filter size={32} className="text-info mb-2" />
                <h3>{categories.length}</h3>
                <small className="text-muted">Categories</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Category Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>
              <Settings size={16} className="me-2" />
              Filter by Category
            </Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Skills Grid */}
      <Row className="mb-4">
        {skills.map((skill, idx) => (
          <Col key={idx} md={6} lg={4} className="mb-4">
            <Card
              className="h-100 shadow-sm cursor-pointer hover-shadow"
              onClick={() => setSelectedSkill(skill)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0">{skill.skill_name}</h5>
                  <Badge bg={getDemandColor(skill.demand_score)}>
                    {skill.demand_score}/100
                  </Badge>
                </div>

                <Badge bg="secondary" className="mb-3">
                  {skill.category}
                </Badge>

                <div className="mb-2">
                  <small className="text-muted d-flex align-items-center">
                    <TrendingUp size={14} className="me-1" />
                    Growth: <Badge bg={getGrowthColor(skill.growth_rate)} className="ms-2">
                      {skill.growth_rate}
                    </Badge>
                  </small>
                </div>

                <div className="mb-2">
                  <small className="text-muted d-flex align-items-center">
                    <DollarSign size={14} className="me-1" />
                    {skill.average_salary}
                  </small>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-flex align-items-center">
                    <Briefcase size={14} className="me-1" />
                    {skill.job_openings.toLocaleString()} openings
                  </small>
                </div>

                <div className="d-flex flex-wrap gap-1">
                  {skill.related_skills.slice(0, 3).map((related, idx) => (
                    <Badge key={idx} bg="light" text="dark" className="fw-normal">
                      {related}
                    </Badge>
                  ))}
                  {skill.related_skills.length > 3 && (
                    <Badge bg="light" text="dark" className="fw-normal">
                      +{skill.related_skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Fastest Growing Skills */}
      {analytics && analytics.fastest_growing.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <TrendingUp className="me-2" />
              Fastest Growing Skills
            </h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Growth Rate</th>
                  <th>Demand</th>
                  <th>Job Openings</th>
                </tr>
              </thead>
              <tbody>
                {analytics.fastest_growing.map((skill, idx) => (
                  <tr key={idx} onClick={() => setSelectedSkill(skill)} style={{ cursor: 'pointer' }}>
                    <td><strong>{skill.skill_name}</strong></td>
                    <td><Badge bg="secondary">{skill.category}</Badge></td>
                    <td>
                      <Badge bg={getGrowthColor(skill.growth_rate)}>
                        {skill.growth_rate}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getDemandColor(skill.demand_score)}>
                        {skill.demand_score}/100
                      </Badge>
                    </td>
                    <td>{skill.job_openings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setSelectedSkill(null)}
        >
          <div
            className="position-absolute top-50 start-50 translate-middle bg-white rounded p-4"
            style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h3>{selectedSkill.skill_name}</h3>
              <button
                className="btn-close"
                onClick={() => setSelectedSkill(null)}
              />
            </div>

            <Row className="mb-3">
              <Col>
                <small className="text-muted d-block">Demand Score</small>
                <Badge bg={getDemandColor(selectedSkill.demand_score)} className="fs-6">
                  {selectedSkill.demand_score}/100
                </Badge>
              </Col>
              <Col>
                <small className="text-muted d-block">Growth Rate</small>
                <Badge bg={getGrowthColor(selectedSkill.growth_rate)} className="fs-6">
                  {selectedSkill.growth_rate}
                </Badge>
              </Col>
            </Row>

            <div className="mb-3">
              <strong>Average Salary</strong>
              <p className="mb-0">{selectedSkill.average_salary}</p>
            </div>

            <div className="mb-3">
              <strong>Job Openings</strong>
              <p className="mb-0">{selectedSkill.job_openings.toLocaleString()}</p>
            </div>

            <div className="mb-3">
              <strong>Trending Since</strong>
              <p className="mb-0">{selectedSkill.trending_since}</p>
            </div>

            <div className="mb-3">
              <strong>Related Skills</strong>
              <div className="d-flex flex-wrap gap-1 mt-2">
                {selectedSkill.related_skills.map((skill, idx) => (
                  <Badge key={idx} bg="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <strong>Top Companies</strong>
              <div className="d-flex flex-wrap gap-1 mt-2">
                {selectedSkill.top_companies.map((company, idx) => (
                  <Badge key={idx} bg="secondary">
                    {company}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <strong>Career Paths</strong>
              <ul className="mt-2">
                {selectedSkill.career_paths.map((path, idx) => (
                  <li key={idx}>{path}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      </Container>
    </>
  );
}
