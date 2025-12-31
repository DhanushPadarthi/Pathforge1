'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Spinner, Nav, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useToast } from '@/contexts/ToastContext';
import { FaUsers, FaGraduationCap, FaBriefcase, FaChartLine, FaCog, FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import './admin.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function AdminDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  // Stats
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  
  // Forms
  const [newRole, setNewRole] = useState({ title: '', required_skills: '', experience_level: 'Entry', description: '' });
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical' });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUserRole, setNewUserRole] = useState('student');

  useEffect(() => {
    const checkAdmin = async () => {
      if (authLoading) return;
      
      console.log('Admin page - checking auth:', { 
        hasUser: !!user, 
        hasUserData: !!userData, 
        userDataRole: userData?.role,
        userData 
      });
      
      if (!user) {
        console.log('No Firebase user, redirecting to login');
        router.push('/login');
        return;
      }
      
      // Wait a moment for userData to load
      if (!userData) {
        console.log('Waiting for userData to load...');
        setTimeout(checkAdmin, 500);
        return;
      }
      
      const isAdmin = userData.role === 'admin';
      console.log('Admin check result:', isAdmin, 'userData.role:', userData.role);
      
      if (!isAdmin) {
        console.log('User is not admin, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }
      
      console.log('User is admin! Fetching data...');
      fetchData();
    };
    
    checkAdmin();
  }, [user, userData, authLoading, router]);

  const fetchData = async () => {
    if (!userData?._id) return;
    
    try {
      setLoading(true);
      
      const statsRes = await fetch(`${API_URL}/api/admin/stats?admin_id=${userData._id}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      const usersRes = await fetch(`${API_URL}/api/admin/users?admin_id=${userData._id}`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
      const rolesRes = await fetch(`${API_URL}/api/career-roles`);
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }
      
      const skillsRes = await fetch(`${API_URL}/api/skills`);
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData);
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/roles?admin_id=${userData._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newRole.title,
          required_skills: newRole.required_skills.split(',').map(s => s.trim()),
          experience_level: newRole.experience_level,
          description: newRole.description,
        }),
      });
      
      if (response.ok) {
        showSuccess('Career role created successfully!');
        setShowRoleModal(false);
        setNewRole({ title: '', required_skills: '', experience_level: 'Entry', description: '' });
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to create role');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to create role');
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/skills?admin_id=${userData._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      
      if (response.ok) {
        showSuccess('Skill created successfully!');
        setShowSkillModal(false);
        setNewSkill({ name: '', category: 'Technical' });
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to create skill');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to create skill');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/skills/${skillId}?admin_id=${userData._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showSuccess('Skill deleted successfully!');
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to delete skill');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to delete skill');
    }
  };

  const handleUpdateUserRole = async () => {
    if (!selectedUser) return;
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/users/role?admin_id=${userData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser._id,
          new_role: newUserRole,
        }),
      });
      
      if (response.ok) {
        showSuccess('User role updated successfully!');
        setShowUserModal(false);
        setSelectedUser(null);
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to update user role');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete the user and all their data permanently.')) return;
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}?admin_id=${userData._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showSuccess('User deleted successfully!');
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to delete user');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to delete user');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this career role?')) return;
    
    if (!userData?._id) {
      showError('Unable to identify admin user');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/career-roles/${roleId}?admin_id=${userData._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showSuccess('Career role deleted successfully!');
        fetchData();
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to delete role');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to delete role');
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="loading-screen">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (!userData) {
    return null;
  }

  const filteredUsers = users.filter(u => 
    userSearch === '' ? true : 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  ).filter(u => 
    roleFilter === 'all' ? true : u.role === roleFilter
  );

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container className="py-5">
          {/* Header */}
          <div className="admin-header mb-5">
            <Row className="align-items-center">
              <Col>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ fontSize: '32px', color: 'white' }}>
                    <FaCog />
                  </div>
                  <div>
                    <h1 className="mb-0" style={{ color: 'white' }}>Admin Dashboard</h1>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Manage users, roles, skills, and system settings</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Statistics */}
          {stats && (
            <Row className="mb-5">
              <Col lg={3} md={6} className="mb-3">
                <Card className="stat-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div style={{ fontSize: '32px', color: '#0066cc', marginRight: '15px' }}>
                        <FaUsers />
                      </div>
                      <div>
                        <h3 className="mb-0">{stats.total_users || 0}</h3>
                        <p className="text-muted mb-0">Total Users</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="stat-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div style={{ fontSize: '32px', color: '#28a745', marginRight: '15px' }}>
                        <FaGraduationCap />
                      </div>
                      <div>
                        <h3 className="mb-0">{stats.total_roadmaps || 0}</h3>
                        <p className="text-muted mb-0">Roadmaps Created</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="stat-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div style={{ fontSize: '32px', color: '#ffc107', marginRight: '15px' }}>
                        📚
                      </div>
                      <div>
                        <h3 className="mb-0">{stats.total_resources || 0}</h3>
                        <p className="text-muted mb-0">Learning Resources</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="stat-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div style={{ fontSize: '32px', color: '#dc3545', marginRight: '15px' }}>
                        <FaChartLine />
                      </div>
                      <div>
                        <h3 className="mb-0">{stats.average_progress || 0}%</h3>
                        <p className="text-muted mb-0">Avg User Progress</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Tabs Navigation */}
          <div className="mb-4">
            <Nav className="admin-tabs" variant="pills">
              <Nav.Item>
                <Nav.Link active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
                  <FaChartLine className="me-2" /> Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'users'} onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
                  <FaUsers className="me-2" /> Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} style={{ cursor: 'pointer' }}>
                  <FaBriefcase className="me-2" /> Career Roles
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} style={{ cursor: 'pointer' }}>
                  <FaGraduationCap className="me-2" /> Skills
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaUsers className="me-2" /> Users Management ({users.length})</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={8}>
                    <InputGroup>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control
                        placeholder="Search users by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                      <option value="all">All Roles</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Skills</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={(user as any).role === 'admin' ? 'danger' : 'info'}>
                            {(user as any).role || 'student'}
                          </Badge>
                        </td>
                        <td>{user.current_skills?.length || 0}</td>
                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => {
                              setSelectedUser(user);
                              setNewUserRole(user.role || 'student');
                              setShowUserModal(true);
                            }}
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaBriefcase className="me-2" /> Career Roles ({roles.length})</h5>
                <Button variant="success" size="sm" onClick={() => setShowRoleModal(true)}>
                  <FaPlus className="me-2" /> Add Role
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Experience Level</th>
                      <th>Required Skills</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role._id}>
                        <td><strong>{role.title}</strong></td>
                        <td>
                          <Badge bg="info">{role.experience_level}</Badge>
                        </td>
                        <td>
                          <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {role.required_skills?.join(', ')}
                          </div>
                        </td>
                        <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {role.description}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteRole(role._id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaGraduationCap className="me-2" /> Skills Management ({skills.length})</h5>
                <Button variant="success" size="sm" onClick={() => setShowSkillModal(true)}>
                  <FaPlus className="me-2" /> Add Skill
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="skills-grid">
                  {skills.map((skill) => (
                    <Card key={skill._id} className="skill-card border">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{skill.name}</h6>
                            <small className="text-muted">{skill.category}</small>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* User Role Modal */}
          <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update User Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedUser && (
                <>
                  <Alert variant="info">
                    <strong>User:</strong> {selectedUser.name} <br />
                    <strong>Email:</strong> {selectedUser.email}
                  </Alert>
                  <Form.Group>
                    <Form.Label>Assign Role</Form.Label>
                    <Form.Select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateUserRole}>
                Update Role
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Create Role Modal */}
          <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Create New Career Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateRole}>
                <Form.Group className="mb-3">
                  <Form.Label>Role Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    placeholder="e.g., Full Stack Developer"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Experience Level</Form.Label>
                  <Form.Select
                    value={newRole.experience_level}
                    onChange={(e) => setNewRole({ ...newRole, experience_level: e.target.value })}
                  >
                    <option>Entry</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Required Skills (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newRole.required_skills}
                    onChange={(e) => setNewRole({ ...newRole, required_skills: e.target.value })}
                    placeholder="e.g., React, Node.js, MongoDB, Python"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Describe this career role and its responsibilities"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Create Role
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Create Skill Modal */}
          <Modal show={showSkillModal} onHide={() => setShowSkillModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Skill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreateSkill}>
                <Form.Group className="mb-3">
                  <Form.Label>Skill Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g., React, Python, Docker"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    <option>Technical</option>
                    <option>Programming Language</option>
                    <option>Framework</option>
                    <option>Tool</option>
                    <option>Database</option>
                    <option>Soft Skill</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add Skill
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
}
