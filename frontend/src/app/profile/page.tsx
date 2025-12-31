'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaUpload, FaTrash, FaFileAlt } from 'react-icons/fa';
import Header from '@/components/Header';
import { userAPI, skillsAPI } from '@/lib/api';
import { CareerRole } from '@/lib/types';

export default function ProfilePage() {
  const { user, userData, loading, refreshUserData } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setTargetRole(userData.target_role_id || '');
      fetchRoles();
    }
  }, [userData]);

  const fetchRoles = async () => {
    try {
      const data = await skillsAPI.getCareerRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      await userAPI.updateUser(userData!._id, {
        name,
        target_role_id: targetRole || null,
      });
      await refreshUserData();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const result = await userAPI.uploadResume(userData!._id, file);
      await refreshUserData();
      setMessage(`Resume uploaded! Extracted ${result.extracted_skills?.length || 0} skills.`);
      setTimeout(() => setMessage(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
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
            <h2 className="mb-4">Profile Settings</h2>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Profile Information */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Profile Information</h5>
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={userData.email}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Target Career Role</Form.Label>
                    <Form.Select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Resume Upload */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Resume</h5>
                {userData.has_resume ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaFileAlt size={30} className="text-success me-3" />
                      <div>
                        <strong>{userData.resume_filename}</strong>
                        <p className="text-muted mb-0">Resume uploaded</p>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as="label"
                        htmlFor="resume-upload"
                        className="me-2"
                      >
                        <FaUpload className="me-2" />
                        Replace
                        <input
                          id="resume-upload"
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleResumeUpload}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded">
                    <FaUpload size={40} className="text-muted mb-3" />
                    <p className="mb-3">Upload your resume for AI skill extraction</p>
                    <Button
                      variant="primary"
                      as="label"
                      htmlFor="resume-upload"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="me-2" />
                          Choose File
                        </>
                      )}
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </Button>
                    <p className="text-muted mt-2 mb-0 small">
                      Supported formats: PDF, DOCX
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Current Skills */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Your Skills</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => router.push('/skills')}
                  >
                    Manage Skills
                  </Button>
                </div>
                {userData.current_skills.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {userData.current_skills.map((skill, index) => (
                      <Badge
                        key={index}
                        bg={
                          skill.proficiency === 'Expert' ? 'success' :
                          skill.proficiency === 'Advanced' ? 'primary' :
                          skill.proficiency === 'Intermediate' ? 'info' :
                          'secondary'
                        }
                      >
                        {skill.name || skill.skill_id} - {skill.proficiency}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">
                    No skills yet. Upload your resume or add skills manually.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
