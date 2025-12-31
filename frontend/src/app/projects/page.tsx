'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { Zap, Bookmark, Clock, TrendingUp, Trash2 } from 'react-feather';
import { FaLightbulb, FaGift } from 'react-icons/fa';
import api from '@/lib/api';
import Header from '@/components/Header';
import { projectTemplates, getAllCategories, searchTemplates } from '@/lib/projectTemplates';

interface ProjectIdea {
  _id?: string;
  title: string;
  description: string;
  difficulty: string;
  technologies: string[];
  estimated_duration: string;
  learning_outcomes: string[];
  resume_impact: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'saved' | 'templates'>('generate');
  const [apiReady, setApiReady] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [focusAreas, setFocusAreas] = useState('');
  const [projectCount, setProjectCount] = useState(3);

  // Initialize API on mount
  useEffect(() => {
    if (api && api.projects) {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'saved' && apiReady) {
      loadSavedProjects();
    }
  }, [activeTab, apiReady]);

  const loadSavedProjects = async () => {
    try {
      if (!api?.projects?.getSaved) {
        console.error('API projects module not available');
        setSavedProjects([]);
        return;
      }
      const response = await api.projects.getSaved();
      setSavedProjects(response || []);
    } catch (err: any) {
      console.error('Failed to load saved projects:', err);
      setSavedProjects([]);
    }
  };

  const generateProjects = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate API is available
    if (!apiReady || !api?.projects?.generate) {
      setError('API not initialized. Please refresh the page.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const focusAreasArray = focusAreas
        .split(',')
        .map(area => area.trim())
        .filter(area => area.length > 0);

      if (focusAreasArray.length === 0) {
        setError('Please enter at least one focus area');
        setLoading(false);
        return;
      }

      const response = await api.projects.generate({
        skill_level: skillLevel,
        focus_areas: focusAreasArray,
        project_count: projectCount
      });

      setProjects(response || []);
      setSuccess(`Generated ${(response || []).length} project ideas!`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate projects');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (project: ProjectIdea) => {
    try {
      await api.projects.saveProject(project);
      setSuccess('Project saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d === 'beginner') return 'success';
    if (d === 'intermediate') return 'warning';
    if (d === 'advanced') return 'danger';
    return 'secondary';
  };

  const getFilteredTemplates = () => {
    let filtered = projectTemplates;
    
    if (templateSearch) {
      filtered = searchTemplates(templateSearch);
    }
    
    if (templateCategory) {
      filtered = filtered.filter(t => t.category === templateCategory);
    }
    
    return filtered;
  };

  const useTemplate = (template: ProjectIdea) => {
    // Populate the form with template data
    setProjects([template]);
    setActiveTab('generate');
    setSuccess(`Template "${template.title}" applied! Click "Save Project" to save this template.`);
    setTimeout(() => setSuccess(''), 5000);
  };

  const deleteProject = async (projectId: string | undefined) => {
    if (!projectId) return;

    if (!window.confirm('Are you sure you want to delete this saved project?')) {
      return;
    }

    try {
      setDeletingId(projectId);
      await api.projects.deleteProject(projectId);
      setSavedProjects(savedProjects.filter(p => p._id !== projectId));
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const exportProject = (project: ProjectIdea) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.replace(/\s+/g, '_')}_project.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const ProjectCard = ({ project, showSaveButton = true, onDelete, isDeletingId }: { project: ProjectIdea; showSaveButton?: boolean; onDelete?: (id: string | undefined) => void; isDeletingId?: string | null }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-0">{project.title}</h5>
            <Badge bg={getDifficultyColor(project.difficulty)} className="mt-1">
              {project.difficulty}
            </Badge>
          </div>
          {!showSaveButton && onDelete && (
            <div className="btn-group btn-group-sm">
              <Button
                variant="outline-secondary"
                size="sm"
                title="Export project"
                onClick={() => exportProject(project)}
                className="btn-sm"
              >
                ⬇️
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                title="Delete project"
                disabled={isDeletingId === project._id}
                onClick={() => onDelete(project._id)}
                className="btn-sm"
              >
                {isDeletingId === project._id ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Trash2 size={14} />
                )}
              </Button>
            </div>
          )}
        </div>

        <p className="text-muted mb-3">{project.description}</p>

        <div className="mb-3">
          <small className="text-muted d-flex align-items-center mb-2">
            <Clock size={14} className="me-1" />
            Duration: {project.estimated_duration}
          </small>
          <div className="d-flex flex-wrap gap-1">
            {project.technologies.map((tech, idx) => (
              <Badge key={idx} bg="primary" className="fw-normal">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <strong className="d-block mb-2">Learning Outcomes:</strong>
          <ul className="small mb-0">
            {project.learning_outcomes.slice(0, 3).map((outcome, idx) => (
              <li key={idx}>{outcome}</li>
            ))}
          </ul>
        </div>

        <div className="mb-3 p-2 bg-light rounded">
          <small className="text-muted d-flex align-items-start">
            <TrendingUp size={14} className="me-1 mt-1 flex-shrink-0" />
            <span><strong>Resume Impact:</strong> {project.resume_impact}</span>
          </small>
        </div>

        {showSaveButton && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => saveProject(project)}
            className="w-100"
          >
            <Bookmark size={16} className="me-1" />
            Save Project
          </Button>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Header />
      <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">
          <FaLightbulb className="me-2" />
          AI Project Generator
        </h1>
        <p className="text-muted">
          Get personalized, resume-ready project ideas powered by AI
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4">
        <Button
          variant={activeTab === 'generate' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('generate')}
          className="me-2"
        >
          Generate Projects
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('templates')}
          className="me-2"
        >
          <FaGift className="me-1" />
          Templates
        </Button>
        <Button
          variant={activeTab === 'saved' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('saved')}
        >
          Saved Projects ({savedProjects.length})
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {activeTab === 'generate' ? (
        <>
          {/* Generation Form */}
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={generateProjects}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Skill Level</Form.Label>
                      <Form.Select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Focus Areas</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., web development, python, react"
                        value={focusAreas}
                        onChange={(e) => setFocusAreas(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Comma-separated list
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Projects</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={projectCount}
                        onChange={(e) => setProjectCount(parseInt(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="me-2" />
                      Generate Project Ideas
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Generated Projects */}
          {projects.length > 0 && (
            <Row>
              {projects.map((project, idx) => (
                <Col key={idx} md={6} lg={4} className="mb-4">
                  <ProjectCard project={project} />
                </Col>
              ))}
            </Row>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center py-5 text-muted">
              <Zap size={48} className="mb-3" />
              <p>Fill in the form above and click "Generate Project Ideas" to get started!</p>
            </div>
          )}
        </>
      ) : activeTab === 'templates' ? (
        <>
          {/* Templates Section */}
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Project Templates Library</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Search Templates</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by title, tech, or category..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Filter by Category</Form.Label>
                    <Form.Select
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {getAllCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {getFilteredTemplates().length > 0 ? (
            <Row>
              {getFilteredTemplates().map((template, idx) => (
                <Col key={idx} md={6} lg={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <div className="mb-2">
                        <Badge bg={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge bg="info" className="ms-2">{template.category}</Badge>
                      </div>
                      <h5 className="mt-2 mb-2">{template.title}</h5>
                      <p className="small text-muted mb-3">{template.description}</p>

                      <div className="mb-3">
                        <small className="text-muted"><strong>Technologies:</strong></small>
                        <div className="mt-1">
                          {template.technologies.map((tech, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3 p-2 bg-light rounded">
                        <small><Clock size={14} className="me-1" />{template.estimated_duration}</small>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => useTemplate(template)}
                        className="w-100"
                      >
                        <FaGift size={14} className="me-1" />
                        Use Template
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5 text-muted">
              <FaGift size={48} className="mb-3" />
              <p>No templates match your search. Try adjusting your filters!</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Saved Projects */}
          {savedProjects.length > 0 ? (
            <Row>
              {savedProjects.map((project, idx) => (
                <Col key={idx} md={6} lg={4} className="mb-4">
                  <ProjectCard 
                    project={project} 
                    showSaveButton={false}
                    onDelete={deleteProject}
                    isDeletingId={deletingId}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5 text-muted">
              <Bookmark size={48} className="mb-3" />
              <p>No saved projects yet. Generate some ideas and save your favorites!</p>
            </div>
          )}
        </>
      )}
      </Container>
    </>
  );
}
