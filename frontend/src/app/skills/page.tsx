'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form, Modal } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Header from '@/components/Header';
import { userAPI, skillsAPI } from '@/lib/api';
import { Skill } from '@/lib/types';

export default function SkillsPage() {
  const { user, userData, loading, refreshUserData } = useAuth();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillsAPI.getAllSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleAddSkill = async () => {
    try {
      await userAPI.addSkill(userData!._id, {
        skill_id: selectedSkill,
        proficiency,
      });
      await refreshUserData();
      setShowAddModal(false);
      setSelectedSkill('');
      setProficiency('Beginner');
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await userAPI.deleteSkill(userData!._id, skillId);
      await refreshUserData();
    } catch (error) {
      console.error('Error deleting skill:', error);
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
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2>Your Skills</h2>
              <div>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => router.push('/skills/gap-analysis')}
                >
                  Analyze Gap
                </Button>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  <FaPlus className="me-2" />
                  Add Skill
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {userData.current_skills.length > 0 ? (
            userData.current_skills.map((userSkill, index) => {
              const skill = skills.find(s => s._id === userSkill.skill_id);
              return (
                <Col md={6} lg={4} key={index}>
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1">{skill?.name || userSkill.skill_id}</h5>
                          <Badge bg={
                            userSkill.proficiency === 'Expert' ? 'success' :
                            userSkill.proficiency === 'Advanced' ? 'primary' :
                            userSkill.proficiency === 'Intermediate' ? 'info' :
                            'secondary'
                          }>
                            {userSkill.proficiency}
                          </Badge>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteSkill(userSkill.skill_id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      {skill && (
                        <>
                          <p className="text-muted small mb-2">
                            <strong>Category:</strong> {skill.category}
                          </p>
                          <p className="small mb-0">{skill.description}</p>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col>
              <Card className="text-center p-5">
                <Card.Body>
                  <h4>No skills added yet</h4>
                  <p className="text-muted">
                    Upload your resume or add skills manually to get started
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button variant="primary" onClick={() => router.push('/profile')}>
                      Upload Resume
                    </Button>
                    <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
                      Add Skill Manually
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Add Skill Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Skill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Skill</Form.Label>
                <Form.Select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">Choose a skill...</option>
                  {skills.filter(s => !userData.current_skills.find(us => us.skill_id === s._id)).map((skill) => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Proficiency Level</Form.Label>
                <Form.Select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSkill}
              disabled={!selectedSkill}
            >
              Add Skill
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
